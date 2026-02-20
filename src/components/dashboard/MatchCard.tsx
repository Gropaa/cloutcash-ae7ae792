import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Bookmark, BookmarkCheck, Eye } from "lucide-react";
import { useState } from "react";

interface MatchCardProps {
  matchProfile: {
    id: string;
    full_name: string;
    handle?: string;
    niche?: string;
    follower_count?: number;
    marketing_budget?: number;
    engagement_rate?: number;
    location?: string;
  };
  matchScore: number;
  onSendRequest: () => void;
  onSave: () => void;
  onChat: () => void;
  isSaved: boolean;
  isCreator: boolean;
}

export const MatchCard = ({
  matchProfile,
  matchScore,
  onSendRequest,
  onSave,
  onChat,
  isSaved,
  isCreator,
}: MatchCardProps) => {
  const navigate = useNavigate();
  const [isRequestSent, setIsRequestSent] = useState(false);

  const handleSendRequest = () => {
    setIsRequestSent(true);
    onSendRequest();
  };
console.log("HANDLE FROM DB:", matchProfile.handle);
  return (
    <Card className="p-6 hover:shadow-lg transition-all border-primary/20 bg-gradient-to-br from-card to-card/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{matchProfile.full_name}</h3>
          {matchProfile.handle && (
            <p className="text-sm text-muted-foreground mb-2">
            @{matchProfile.handle}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-3">
            {matchProfile.niche && (
              <Badge variant="secondary">{matchProfile.niche}</Badge>
            )}
            {matchProfile.location && (
              <Badge variant="outline">{matchProfile.location}</Badge>
            )}
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            {isCreator && matchProfile.marketing_budget && (
              <span>Budget: ${matchProfile.marketing_budget.toLocaleString()}</span>
            )}
            {!isCreator && matchProfile.follower_count && (
              <span>Followers: {matchProfile.follower_count.toLocaleString()}</span>
            )}
            {matchProfile.engagement_rate && (
              <span>Engagement: {matchProfile.engagement_rate}%</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span className="text-3xl font-bold text-primary">
              {matchScore}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Match Score</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1"
          onClick={handleSendRequest}
          disabled={isRequestSent}
        >
          {isRequestSent ? "Request Sent" : "Send Request"}
        </Button>
        <Button size="sm" variant="outline" onClick={onChat}>
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={isSaved ? "default" : "outline"}
          onClick={onSave}
        >
          {isSaved ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => navigate(`/profile/${matchProfile.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
