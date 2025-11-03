import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Eye } from "lucide-react";

interface AnalyticsDashboardProps {
  isCreator: boolean;
  stats: {
    reach?: number;
    engagementRate?: number;
    acceptedOffers?: number;
    campaignROI?: number;
    savedInfluencers?: number;
    totalSpend?: number;
  };
}

export const AnalyticsDashboard = ({
  isCreator,
  stats,
}: AnalyticsDashboardProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Overview</h2>
      
      {isCreator ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Total Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.reach?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all platforms
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-green-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Engagement Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.engagementRate || "0"}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average across content
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-yellow-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Accepted Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.acceptedOffers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Brand collaborations
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Campaign ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.campaignROI || "0"}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average return on investment
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-green-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Saved Influencers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.savedInfluencers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                In your talent pool
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-yellow-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Spend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${(stats.totalSpend || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all campaigns
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
