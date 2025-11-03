import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
}

export const ChatModal = ({
  isOpen,
  onClose,
  recipientName,
}: ChatModalProps) => {
  const [message, setMessage] = useState("");
  const [messages] = useState([
    {
      id: 1,
      sender: "them",
      text: "Hi! I'm interested in collaborating with you.",
      timestamp: "2 min ago",
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    // Mock send - would integrate with real backend
    setMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat with {recipientName}</DialogTitle>
          <DialogDescription>
            Start a conversation about potential collaborations
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
            <div className="text-center text-sm text-muted-foreground py-8">
              <p>💬 Chat preview - Full messaging coming soon!</p>
              <p className="mt-2">
                Type a message below to see how it would appear.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
