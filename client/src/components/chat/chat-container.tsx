import MessageBubble from "./message-bubble";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  role: string;
  content: string;
  model: "dobby_leashed" | "unhinged";
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            <Skeleton
              className={`h-20 ${
                i % 2 === 0 ? "w-2/3" : "w-1/2"
              } rounded-lg`}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          content={message.content}
          model={message.model}
        />
      ))}
    </div>
  );
}
