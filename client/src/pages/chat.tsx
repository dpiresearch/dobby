import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ChatContainer from "@/components/chat/chat-container";
import { useMutation } from "@tanstack/react-query";
import { generateConversation } from "@/lib/chat-service";

export default function Chat() {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const generateMutation = useMutation({
    mutationFn: () => generateConversation((newMessages) => {
      setMessages(newMessages);
      // Scroll to bottom when new message arrives
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }),
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  useEffect(() => {
    generateMutation.mutate();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto h-[90vh] p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Conversation Viewer
          </h1>
          <div className="flex gap-2">
            <span className="text-sm text-gray-500">dobby_leashed</span>
            <span className="text-sm text-gray-500">vs</span>
            <span className="text-sm text-gray-500">Unhinged</span>
          </div>
        </div>

        <div ref={containerRef} className="flex-1 overflow-y-auto">
          <ChatContainer 
            messages={messages}
            isLoading={generateMutation.isPending && messages.length === 0}
          />
        </div>
      </Card>
    </div>
  );
}