import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isCharacter?: boolean;
  characterName?: string;
}

const ChatBubble = ({ message, isCharacter = true, characterName = "Arjun" }: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "animate-fade-in-up max-w-[85%]",
        isCharacter ? "self-start" : "self-end"
      )}
    >
      {isCharacter && (
        <span className="text-xs font-semibold text-primary ml-3 mb-1 block">
          {characterName} 💫
        </span>
      )}
      <div
        className={cn(
          "px-5 py-3.5 rounded-2xl text-sm leading-relaxed",
          isCharacter
            ? "gradient-card shadow-dreamy rounded-tl-sm text-foreground"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        )}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
