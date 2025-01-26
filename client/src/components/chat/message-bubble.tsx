import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  model: "dobby_leashed" | "unhinged";
}

export default function MessageBubble({ content, model }: MessageBubbleProps) {
  const isLeashed = model === "dobby_leashed";

  return (
    <div
      className={cn(
        "flex",
        isLeashed ? "justify-start" : "justify-end",
        "mb-4"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isLeashed
            ? "bg-blue-100 text-blue-900"
            : "bg-purple-100 text-purple-900"
        )}
      >
        <div className="text-xs font-medium mb-1">
          {isLeashed ? "dobby_leashed" : "Unhinged"}
        </div>
        <div className="text-sm whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
}
