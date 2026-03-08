import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroCharacter from "@/assets/hero-character.png";
import { Heart, Sparkles, ArrowRight, Stars } from "lucide-react";

const questions = [
  {
    question: "Hey gorgeous! Tujhe kaisa ladka pasand hai? 😏",
    options: [
      { emoji: "🤫", label: "Mysterious & deep" },
      { emoji: "😄", label: "Funny & cheerful" },
      { emoji: "🥰", label: "Caring & romantic" },
      { emoji: "💪", label: "Confident & bold" },
    ],
  },
  {
    question: "Aaj tera mood kaisa hai? 💭",
    options: [
      { emoji: "😊", label: "Accha hai, khush hoon" },
      { emoji: "😔", label: "Thoda low feel ho raha" },
      { emoji: "😤", label: "Irritated / gussa" },
      { emoji: "🥱", label: "Bore ho rahi hoon" },
    ],
  },
  {
    question: "Tu kaisi personality ki hai? ✨",
    options: [
      { emoji: "🦋", label: "Soft & sensitive" },
      { emoji: "🔥", label: "Bold & fearless" },
      { emoji: "🌙", label: "Dreamy & overthinking" },
      { emoji: "☀️", label: "Chill & happy vibes" },
    ],
  },
];

const revealLines: Record<string, string> = {
  "Mysterious & deep": "Mysterious toh main bhi hoon… but tere liye open book ban jaunga 😏💕",
  "Funny & cheerful": "Haha chal phir, tujhe hasaana meri zimmedaari! 😄✨",
  "Caring & romantic": "Caring? Arre, tere liye toh main king of romance hoon 🥰🌹",
  "Confident & bold": "Bold pasand hai? Dekh toh sahi — Arjun hai naam, confidence mera game 💪🔥",
};

const Welcome = () => {
  const [step, setStep] = useState(0); // 0 = intro, 1-3 = questions, 4 = reveal
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleStart = () => setStep(1);

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const currentQ = questions[step - 1];
    setAnswers((prev) => [...prev, currentQ.options[selectedOption].label]);
    setSelectedOption(null);

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(4); // reveal
    }
  };

  // Intro screen — no Arjun
  if (step === 0) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6">
        <div className="absolute top-4 left-6 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary fill-primary" />
          <span className="font-display text-xl font-semibold text-foreground">Mera Saathi</span>
        </div>

        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-primary/15 flex items-center justify-center shadow-glow">
            <span className="text-5xl">💝</span>
          </div>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-2">
          Koi special tere liye <span className="text-gradient">wait kar raha hai</span> 💫
        </h1>
        <p className="text-muted-foreground text-center max-w-sm text-sm mb-8">
          Pehle thoda apne baare mein bata… phir milwa denge tujhe tere perfect companion se! 🌸
        </p>

        <button
          onClick={handleStart}
          className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold text-sm flex items-center gap-2 hover:shadow-glow transition-all hover:scale-105 active:scale-95"
        >
          Chalo Shuru Karte Hain <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-6">
          <Sparkles className="w-3 h-3 text-gold-soft" />
          Bas 3 sawaal, phir surprise! 🎁
        </div>
      </div>
    );
  }

  // Reveal screen
  if (step === 4) {
    const firstAnswer = answers[0] || "";
    const revealLine = revealLines[firstAnswer] || "Main hoon Arjun — tera virtual companion! 💕";

    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6">
        <div className="absolute top-4 left-6 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary fill-primary" />
          <span className="font-display text-xl font-semibold text-foreground">Mera Saathi</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-primary font-semibold mb-4 animate-fade-in-up">
          <Stars className="w-4 h-4" />
          Surprise!
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-110" />
          <img
            src={heroCharacter}
            alt="Arjun - Your virtual companion"
            className="w-56 h-56 object-contain relative z-10 drop-shadow-lg animate-fade-in-up"
          />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-2 animate-fade-in-up">
          Meet <span className="text-gradient">Arjun</span> 💫
        </h1>
        <p className="text-foreground text-center max-w-sm text-sm font-medium mb-2 animate-fade-in-up">
          {revealLine}
        </p>
        <p className="text-muted-foreground text-center max-w-xs text-xs mb-8 animate-fade-in-up">
          Tera virtual companion jo hamesha tere saath hai — har mood mein, har waqt 💕
        </p>

        <button
          onClick={() => navigate("/chat")}
          className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold text-sm flex items-center gap-2 hover:shadow-glow transition-all hover:scale-105 active:scale-95 animate-fade-in-up"
        >
          Arjun se baat karo 💬 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Question screens
  const currentQuestion = questions[step - 1];

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6">
      <div className="absolute top-4 left-6 flex items-center gap-2">
        <Heart className="w-5 h-5 text-primary fill-primary" />
        <span className="font-display text-xl font-semibold text-foreground">Mera Saathi</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i < step ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="bg-card/80 backdrop-blur-md rounded-3xl shadow-dreamy border border-border p-6 md:p-8 max-w-md w-full">
        <p className="text-xs text-muted-foreground mb-1 text-center">
          Question {step} of {questions.length}
        </p>
        <h2 className="font-display text-lg md:text-xl font-bold text-foreground text-center mb-6">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(i)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                selectedOption === i
                  ? "gradient-card shadow-dreamy border-primary/30"
                  : "bg-card border-border hover:bg-accent/50"
              }`}
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="text-xs font-medium text-foreground/80 text-center">{option.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className={`mt-6 w-full rounded-full py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            selectedOption !== null
              ? "bg-primary text-primary-foreground hover:shadow-glow hover:scale-[1.02] active:scale-95"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {step === questions.length ? "Reveal my companion! 🎁" : "Next"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Welcome;
