import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroCharacter from "@/assets/hero-character.png";
import { Heart, Sparkles, ArrowRight } from "lucide-react";

const questions = [
  {
    question: "Hey cutie! Pehle bata, tu kaisi soul hai? 🌸",
    options: [
      { emoji: "🦋", label: "Soft & sensitive" },
      { emoji: "🔥", label: "Bold & fearless" },
      { emoji: "🌙", label: "Dreamy & lost in thoughts" },
      { emoji: "☀️", label: "Happy-go-lucky" },
    ],
  },
  {
    question: "Jab dil udaas hota hai, tu kya karti hai? 💭",
    options: [
      { emoji: "🎵", label: "Gaane sunti hoon" },
      { emoji: "😢", label: "Akele ro leti hoon" },
      { emoji: "🍫", label: "Chocolate kha leti hoon" },
      { emoji: "📱", label: "Kisi se baat karti hoon" },
    ],
  },
  {
    question: "Tujhe kya sabse zyada special feel karata hai? ✨",
    options: [
      { emoji: "🤗", label: "Ek garam hug" },
      { emoji: "💌", label: "Pyaare words sunna" },
      { emoji: "🌹", label: "Surprise gifts" },
      { emoji: "⏰", label: "Quality time saath mein" },
    ],
  },
];

const Welcome = () => {
  const [step, setStep] = useState(0); // 0 = welcome screen, 1-3 = questions
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
      navigate("/chat");
    }
  };

  // Welcome screen
  if (step === 0) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6">
        <div className="absolute top-4 left-6 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary fill-primary" />
          <span className="font-display text-xl font-semibold text-foreground">Mera Saathi</span>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-110" />
          <img
            src={heroCharacter}
            alt="Arjun"
            className="w-48 h-48 object-contain relative z-10 drop-shadow-lg animate-fade-in-up"
          />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-2">
          Welcome to <span className="text-gradient">Mera Saathi</span> 💫
        </h1>
        <p className="text-muted-foreground text-center max-w-sm text-sm mb-8">
          Main hoon Arjun — tera virtual companion. Chal pehle thoda tujhe jaanta hoon! 🌸
        </p>

        <button
          onClick={handleStart}
          className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold text-sm flex items-center gap-2 hover:shadow-glow transition-all hover:scale-105 active:scale-95"
        >
          Let's Go <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-6">
          <Sparkles className="w-3 h-3 text-gold-soft" />
          Bas 3 cute sawaal hai, promise!
        </div>
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
              i < step ? "bg-primary" : i === step - 1 ? "bg-primary" : "bg-border"
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
          {step === questions.length ? "Chalo Arjun se milte hain! 💕" : "Next"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Welcome;
