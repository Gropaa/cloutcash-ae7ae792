import { CheckCircle2, Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileCompletionResult } from "@/lib/profileCompletion";

interface ProfileChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completionData: ProfileCompletionResult;
  userType: string;
}

export function ProfileChecklistModal({
  open,
  onOpenChange,
  completionData,
  userType,
}: ProfileChecklistModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Completion Checklist</DialogTitle>
          <DialogDescription>
            Complete these items to unlock better matches as a {userType}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {completionData.checklist.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={
                  item.completed
                    ? "text-sm font-medium"
                    : "text-sm text-muted-foreground"
                }
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-center">
            <span className="font-bold text-lg text-primary">
              {completionData.percentage}%
            </span>{" "}
            complete
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
