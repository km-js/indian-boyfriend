import { cn } from "@/lib/utils";

interface EmotionButtonProps {
  emoji: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const EmotionButton = ({ emoji, label, onClick, active }: EmotionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-0 sm:gap-1 px-1.5 py-1 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-2xl transition-all duration-300 shrink-0 whitespace-nowrap min-w-0",
        "hover:scale-105 hover:shadow-dreamy active:scale-95",
        "border border-border",
        active
          ? "gradient-card shadow-dreamy border-primary/30"
          : "bg-card hover:bg-accent/50"
      )}
    >
      <span className="text-sm sm:text-2xl">{emoji}</span>
      <span className="text-[8px] sm:text-xs font-medium text-foreground/80 leading-tight">{label}</span>
    </button>
  );
};

export default EmotionButton;
