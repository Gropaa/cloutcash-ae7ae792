import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Briefcase, Users, MessageSquare, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RecommendedMatches } from "./RecommendedMatches";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { computeProfileCompletion } from "@/lib/profileCompletion";

interface Profile {
  id: string;
  full_name: string;
  user_type: string;
  handle?: string;
  marketing_budget?: number;
  niche?: string;
  profile_completed: boolean;
  location?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  goal?: string;
  website?: string;
  follower_count?: number;
  engagement_rate?: number;
}

export function BrandDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data);

      const completion = computeProfileCompletion(data);
      setProfileCompletion(completion.percentage);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    campaignROI: 0, // Mock data
    savedInfluencers: 0, // Mock data
    totalSpend: profile?.marketing_budget || 0,
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Welcome back, {profile?.full_name}! 🚀</h1>
            <p className="text-muted-foreground mt-2">Manage your brand campaigns and creator partnerships</p>
          </div>
        </div>

        {/* Profile Completion */}
        {profileCompletion < 100 && (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Complete Your Brand Profile</CardTitle>
              <CardDescription>
                {profileCompletion}% complete - Attract top creators by completing your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={profileCompletion} className="h-3" />
              <Button onClick={() => navigate("/profile-setup")}>View Checklist</Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Campaign Creation */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Campaign Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/campaigns")}>
                <Plus className="w-6 h-6" />
                <span>Create Campaign</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/discover")}>
                <Users className="w-6 h-6" />
                <span>Find Creators</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/matches")}>
                <CheckCircle className="w-6 h-6" />
                <span>View Matches</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <AnalyticsDashboard isCreator={false} stats={stats} />

        {/* Recommended Creators */}
        <RecommendedMatches userType="brand" />

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate("/matches")}>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">View Matches</h3>
              <p className="text-sm text-muted-foreground">See your creator matches</p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate("/messages")}>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Messages</h3>
              <p className="text-sm text-muted-foreground">Chat with creators</p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate("/campaigns")}>
            <CardContent className="pt-6 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Campaigns</h3>
              <p className="text-sm text-muted-foreground">Manage campaigns</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Pipeline Preview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Campaign Pipeline
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/campaigns")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold text-muted-foreground">0</p>
                <p className="text-sm text-muted-foreground">Draft</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold text-muted-foreground">0</p>
                <p className="text-sm text-muted-foreground">Negotiation</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold text-muted-foreground">0</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
