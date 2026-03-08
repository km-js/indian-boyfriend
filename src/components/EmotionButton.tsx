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
        "flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl transition-all duration-300 shrink-0 whitespace-nowrap",
        "hover:scale-105 hover:shadow-dreamy active:scale-95",
        "border border-border",
        active
          ? "gradient-card shadow-dreamy border-primary/30"
          : "bg-card hover:bg-accent/50"
      )}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs font-medium text-foreground/80">{label}</span>
    </button>
  );
};

export default EmotionButton;
