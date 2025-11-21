import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Briefcase, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_type: string;
  full_name: string;
}

export default function CampaignsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

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

  if (loading) {
    return (
      <>
        <Navbar onHomeClick={() => {}} onContactClick={() => {}} onAboutClick={() => {}} />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  const isCreator = profile?.user_type === "creator";

  return (
    <>
      <Navbar onHomeClick={() => {}} onContactClick={() => {}} onAboutClick={() => {}} />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="container mx-auto px-4 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Briefcase className="w-10 h-10 text-primary" />
                Campaigns
              </h1>
              <p className="text-muted-foreground mt-2">
                {isCreator 
                  ? "Manage your campaign offers and active collaborations"
                  : "Create and manage your brand campaigns"}
              </p>
            </div>
            {!isCreator && (
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create Campaign
              </Button>
            )}
          </div>

          {isCreator ? (
            // Creator View
            <Tabs defaultValue="offers" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="offers">Offers</TabsTrigger>
                <TabsTrigger value="proposals">Proposals</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
              </TabsList>

              <TabsContent value="offers" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Incoming Campaign Offers</CardTitle>
                    <CardDescription>Review and respond to brand campaign offers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-semibold mb-2">No pending offers</p>
                      <p className="text-sm">When brands send you campaign offers, they'll appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="proposals" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Proposals</CardTitle>
                    <CardDescription>Track proposals you've sent to brands</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No proposals sent yet</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="active" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Campaigns</CardTitle>
                    <CardDescription>Your ongoing brand collaborations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-semibold mb-2">No active campaigns</p>
                      <p className="text-sm">Accept campaign offers to start collaborating with brands</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="earnings" className="space-y-4 mt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-3xl font-bold">$0</p>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-3xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-3xl font-bold">$0</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            // Brand View
            <Tabs defaultValue="draft" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="draft" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Draft Campaigns</CardTitle>
                        <CardDescription>Campaigns you're still working on</CardDescription>
                      </div>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Campaign
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-semibold mb-2">No draft campaigns</p>
                      <p className="text-sm">Create your first campaign to start finding creators</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="negotiation" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>In Negotiation</CardTitle>
                    <CardDescription>Campaigns being discussed with creators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No campaigns in negotiation</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="active" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Campaigns</CardTitle>
                    <CardDescription>Currently running campaigns with creators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-semibold mb-2">No active campaigns</p>
                      <p className="text-sm">Launch campaigns to start collaborating with creators</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Campaigns</CardTitle>
                    <CardDescription>Successfully finished campaigns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No completed campaigns yet</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </>
  );
}
