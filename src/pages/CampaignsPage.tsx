import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Briefcase, DollarSign, Clock, CheckCircle, Calendar, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { CreateCampaignModal } from "@/components/campaigns/CreateCampaignModal";
import { format } from "date-fns";

interface Profile {
  id: string;
  user_type: string;
  full_name: string;
}

interface Campaign {
  id: string;
  title: string;
  budget: number;
  deliverables: string;
  start_date: string;
  end_date: string;
  status: string;
  brand_id: string;
  creator_id: string | null;
  brand_profile?: {
    full_name: string;
    avatar_url: string | null;
  };
  creator_profile?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export default function CampaignsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      fetchCampaigns();
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_type, full_name")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    if (!profile) return;

    try {
      let query = supabase
        .from("campaigns")
        .select(`
          *,
          brand_profile:profiles!campaigns_brand_id_fkey(full_name, avatar_url),
          creator_profile:profiles!campaigns_creator_id_fkey(full_name, avatar_url)
        `);

      // Filter based on user type
      if (profile.user_type === "creator") {
        query = query.or(`creator_id.eq.${profile.id},creator_id.is.null`);
      } else {
        query = query.eq("brand_id", profile.id);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const getCampaignsByStatus = (status: string | string[]) => {
    const statuses = Array.isArray(status) ? status : [status];
    return campaigns.filter(c => statuses.includes(c.status));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-muted-foreground/40"></div>
        </div>
      </>
    );
  }

  const isCreator = profile?.user_type === "creator";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          {/* Header - Calm & minimal */}
          <div className="flex justify-between items-center py-4 border-b border-border/50">
            <div>
              <h1 className="text-2xl font-semibold text-foreground/90">
                Campaigns
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isCreator 
                  ? "View and manage your collaborations"
                  : "Organize and track your campaigns"}
              </p>
            </div>
            {!isCreator && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 text-muted-foreground hover:text-foreground border-border/60 hover:border-border hover:bg-muted/50" 
                onClick={() => setCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                New Campaign
              </Button>
            )}
          </div>

          {isCreator ? (
            // Creator View
            <Tabs defaultValue="offers" className="w-full">
              <TabsList className="bg-muted/30 border border-border/40 p-1 h-auto">
                <TabsTrigger value="offers" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
                  Offers
                </TabsTrigger>
                <TabsTrigger value="proposals" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
                  Proposals
                </TabsTrigger>
                <TabsTrigger value="active" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
                  Active
                </TabsTrigger>
                <TabsTrigger value="earnings" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
                  Earnings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="offers" className="space-y-3 mt-5">
                {getCampaignsByStatus("proposed").length > 0 ? (
                  getCampaignsByStatus("proposed").map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} onClick={() => navigate(`/campaigns/${campaign.id}`)} />
                  ))
                ) : (
                  <EmptyState 
                    title="Your offers will show here"
                    description="When a brand reaches out, you'll see their campaign details right away"
                  />
                )}
              </TabsContent>

              <TabsContent value="proposals" className="space-y-3 mt-5">
                <EmptyState 
                  title="Your proposals live here"
                  description="Any pitches or ideas you send to brands will be organized in one place"
                />
              </TabsContent>

              <TabsContent value="active" className="space-y-3 mt-5">
                {getCampaignsByStatus(["accepted", "active"]).length > 0 ? (
                  getCampaignsByStatus(["accepted", "active"]).map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} onClick={() => navigate(`/campaigns/${campaign.id}`)} />
                  ))
                ) : (
                  <EmptyState 
                    title="Active work shows here"
                    description="Once a campaign kicks off, you'll track progress and updates from this view"
                  />
                )}
              </TabsContent>

              <TabsContent value="earnings" className="space-y-4 mt-5">
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Total Earned" value="$0" />
                  <StatCard label="Completed" value="0" />
                  <StatCard label="Pending" value="$0" />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            // Brand View
            <Tabs defaultValue="draft" className="w-full">
              <TabsList className="bg-muted/30 border border-border/40 p-1 h-auto">
                <TabsTrigger value="draft" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
                  Draft
                </TabsTrigger>
                <TabsTrigger value="negotiation" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
                  Negotiation
                </TabsTrigger>
                <TabsTrigger value="active" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
                  Active
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="draft" className="space-y-3 mt-5">
                {getCampaignsByStatus("proposed").length > 0 ? (
                  getCampaignsByStatus("proposed").map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} onClick={() => navigate(`/campaigns/${campaign.id}`)} />
                  ))
                ) : (
                  <EmptyState 
                    title="Ready when you are"
                    description="Draft your first campaign here — you can refine it before sending"
                    action={
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setCreateModalOpen(true)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create Campaign
                      </Button>
                    }
                  />
                )}
              </TabsContent>

              <TabsContent value="negotiation" className="space-y-3 mt-5">
                {getCampaignsByStatus("proposed").length > 0 ? (
                  getCampaignsByStatus("proposed").map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} onClick={() => navigate(`/campaigns/${campaign.id}`)} />
                  ))
                ) : (
                  <EmptyState 
                    title="Conversations in progress"
                    description="Once you're discussing terms with a creator, you'll see those campaigns here"
                  />
                )}
              </TabsContent>

              <TabsContent value="active" className="space-y-3 mt-5">
                {getCampaignsByStatus(["accepted", "active"]).length > 0 ? (
                  getCampaignsByStatus(["accepted", "active"]).map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} onClick={() => navigate(`/campaigns/${campaign.id}`)} />
                  ))
                ) : (
                  <EmptyState 
                    title="Live campaigns appear here"
                    description="This is where you'll monitor ongoing collaborations and deliverables"
                  />
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-3 mt-5">
                {getCampaignsByStatus("completed").length > 0 ? (
                  getCampaignsByStatus("completed").map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} onClick={() => navigate(`/campaigns/${campaign.id}`)} />
                  ))
                ) : (
                  <EmptyState 
                    title="Completed work lands here"
                    description="A running record of successful collaborations you've wrapped up"
                  />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Create Campaign Modal */}
      {profile && !isCreator && (
        <CreateCampaignModal 
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          brandProfileId={profile.id}
          onSuccess={fetchCampaigns}
        />
      )}
    </>
  );
}

// Empty State Component - Calm, minimal design
const EmptyState = ({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description: string; 
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      <FileText className="w-5 h-5 text-muted-foreground/60" />
    </div>
    <p className="text-sm font-medium text-foreground/70 mb-1">{title}</p>
    <p className="text-xs text-muted-foreground text-center max-w-xs">{description}</p>
    {action}
  </div>
);

// Stat Card Component - Subtle, refined
const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-muted/20 border border-border/30 rounded-lg p-4 text-center">
    <p className="text-2xl font-semibold text-foreground/80">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{label}</p>
  </div>
);

// Campaign Card Component - Premium, quiet design
const CampaignCard = ({ campaign, onClick }: { campaign: Campaign; onClick: () => void }) => (
  <div 
    className="group bg-card border border-border/40 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-border/70 hover:bg-muted/20"
    onClick={onClick}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-sm font-medium text-foreground/90 truncate">{campaign.title}</h3>
          <Badge 
            variant="outline" 
            className="text-[10px] px-2 py-0.5 font-normal text-muted-foreground border-border/50 bg-muted/30"
          >
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{campaign.deliverables}</p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            ₹{campaign.budget.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(campaign.start_date), "MMM d")}
          </span>
        </div>
      </div>
      
      {campaign.brand_profile && (
        <Avatar className="w-8 h-8 border border-border/30">
          <AvatarImage src={campaign.brand_profile.avatar_url || ""} />
          <AvatarFallback className="text-xs bg-muted/50 text-muted-foreground">
            {campaign.brand_profile.full_name[0]}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  </div>
);
