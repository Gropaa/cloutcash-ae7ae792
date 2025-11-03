import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const PremiumCard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="relative overflow-hidden border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="absolute top-2 right-2">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Premium Match Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Unlock advanced analytics, deeper match insights, and priority
            placement to maximize your collaborations.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="w-full gap-2"
            variant="default"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              CloutCash Pro - Coming Soon!
            </DialogTitle>
            <DialogDescription>
              Get ready for premium features that will transform your
              collaboration experience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">What's included:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✨ Advanced AI match scoring with 10+ data points</li>
                <li>📊 Detailed analytics and ROI tracking</li>
                <li>🎯 Priority placement in search results</li>
                <li>💬 Unlimited messaging and collaboration requests</li>
                <li>🔔 Real-time notifications and alerts</li>
                <li>🎁 Early access to new features</li>
              </ul>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Pro tier launching Q2 2025. Join the waitlist to get 20% off!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
