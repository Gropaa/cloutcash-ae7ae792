import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, DollarSign, TrendingUp, MessageSquare, CheckCircle } from "lucide-react";
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
  follower_count?: number;
  niche?: string;
  profile_completed: boolean;
  engagement_rate?: number;
  location?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  goal?: string;
  website?: string;
  marketing_budget?: number;
}

export function CreatorDashboard() {
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
    reach: profile?.follower_count || 0,
    engagementRate: profile?.engagement_rate || 0,
    acceptedOffers: 0, // Mock data
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Welcome back, {profile?.full_name}! 👋</h1>
            <p className="text-muted-foreground mt-2">Here's your creator dashboard</p>
          </div>
        </div>

        {/* Profile Completion */}
        {profileCompletion < 100 && (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                {profileCompletion}% complete - Stand out to brands by completing your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={profileCompletion} className="h-3" />
              <Button onClick={() => navigate("/profile-setup")}>View Checklist</Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <AnalyticsDashboard isCreator={true} stats={stats} />

        {/* Recommended Brands */}
        <RecommendedMatches userType="creator" />

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate("/matches")}>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">View Matches</h3>
              <p className="text-sm text-muted-foreground">See your brand matches</p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate("/messages")}>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Messages</h3>
              <p className="text-sm text-muted-foreground">Chat with brands</p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate("/campaigns")}>
            <CardContent className="pt-6 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Campaigns</h3>
              <p className="text-sm text-muted-foreground">View your offers</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Preview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Active Campaigns
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/campaigns")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No active campaigns yet</p>
              <p className="text-sm mt-2">Start connecting with brands to receive campaign offers</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
