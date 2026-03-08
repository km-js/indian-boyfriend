import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import heroCharacter from "@/assets/hero-character.png";
import { Heart, Sparkles, ArrowRight, Stars } from "lucide-react";
import confetti from "canvas-confetti";

const questions = [
  {
    question: "Aapko kaisa ladka sabse zyada impress karta hai? 😏",
    options: [
      { emoji: "🤫", label: "Mysterious & deep — jo kam bole par dil jeet le" },
      { emoji: "😄", label: "Funny & cheerful — jo hamesha hasaaye" },
      { emoji: "🥰", label: "Caring & romantic — jo dil se khayal rakhe" },
      { emoji: "💪", label: "Confident & bold — jo apni duniya khud banaye" },
    ],
  },
  {
    question: "Agar abhi aapka dil ek gaana bajaa raha hota, toh kaisa hota? 🎵",
    options: [
      { emoji: "🌸", label: "Soft romantic melody — dil mein sukoon hai" },
      { emoji: "🌧️", label: "Sad slow song — thoda dil bhari hai" },
      { emoji: "🔥", label: "Party anthem — energy high hai!" },
      { emoji: "🌙", label: "Lo-fi beats — neend aa rahi hai" },
    ],
  },
  {
    question: "Aapki personality ka superpower kya hai? ✨",
    options: [
      { emoji: "🦋", label: "Soft heart — sab ki feelings samajh aati hain" },
      { emoji: "🔥", label: "Fearless spirit — duniya se darna nahi aata" },
      { emoji: "🌙", label: "Deep thinker — raat ko stars dekhte hue sochti hoon" },
      { emoji: "☀️", label: "Sunshine energy — mere aas paas sab khush rehte hain" },
    ],
  },
];

const revealLines: Record<string, string> = {
  "Mysterious & deep — jo kam bole par dil jeet le":
    "Mysterious toh main bhi hoon… par aapke liye apna dil khol dunga 😏💕",
  "Funny & cheerful — jo hamesha hasaaye":
    "Haha chaliye phir, aapko hasaana ab meri zimmedaari! 😄✨",
  "Caring & romantic — jo dil se khayal rakhe":
    "Caring? Arre, aapke liye toh main king of romance hoon 🥰🌹",
  "Confident & bold — jo apni duniya khud banaye":
    "Bold pasand hai? Dekhiye toh sahi — Arjun hai naam, confidence mera game 💪🔥",
};

// Floating emoji particle component
const FloatingEmoji = ({ emoji, delay, left }: { emoji: string; delay: number; left: number }) => (
  <span
    className="absolute text-2xl pointer-events-none animate-float-up"
    style={{
      left: `${left}%`,
      animationDelay: `${delay}s`,
      bottom: "-40px",
    }}
  >
    {emoji}
  </span>
);

const Welcome = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  const fireConfetti = useCallback(() => {
    // Rose petals / hearts burst
    const colors = ["#e8748c", "#f5a0b3", "#ffd6e0", "#ff6b8a", "#c94c6e"];
    confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 }, colors, gravity: 0.6, scalar: 1.2 });
    setTimeout(() => {
      confetti({ particleCount: 50, spread: 120, origin: { y: 0.4 }, colors, gravity: 0.5, scalar: 1 });
    }, 300);
  }, []);

  const handleStart = () => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(1);
      setTransitioning(false);
    }, 400);
  };

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const currentQ = questions[step - 1];
    setAnswers((prev) => [...prev, currentQ.options[selectedOption].label]);

    setTransitioning(true);
    setTimeout(() => {
      setSelectedOption(null);
      if (step < questions.length) {
        setStep(step + 1);
      } else {
        setStep(4);
      }
      setTransitioning(false);
    }, 400);
  };

  // Fire confetti on reveal
  useEffect(() => {
    if (step === 4) {
      fireConfetti();
      const timer = setTimeout(fireConfetti, 1200);
      return () => clearTimeout(timer);
    }
  }, [step, fireConfetti]);

  const floatingEmojis = ["💕", "🌹", "✨", "💗", "🦋", "🌸"];

  // Intro screen
  if (step === 0) {
    return (
      <div className={`min-h-screen gradient-hero flex flex-col items-center justify-center px-6 relative overflow-hidden transition-opacity duration-400 ${transitioning ? "opacity-0" : "opacity-100"}`}>
        {/* Floating background emojis */}
        {floatingEmojis.map((e, i) => (
          <FloatingEmoji key={i} emoji={e} delay={i * 1.5} left={10 + i * 15} />
        ))}

        <a href="/" className="absolute top-4 left-6 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Heart className="w-5 h-5 text-primary fill-primary animate-pulse-soft" />
          <span className="font-display text-xl font-semibold text-foreground">Mera Banda</span>
        </a>

        <div className="relative mb-6 animate-fade-in-up">
          <div className="w-36 h-36 rounded-full bg-primary/15 flex items-center justify-center shadow-glow animate-pulse-soft">
            <span className="text-6xl">💝</span>
          </div>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-2 animate-fade-in-up">
          Koi bahut special <span className="text-gradient">aapka intezaar</span> kar raha hai 💫
        </h1>
        <p className="text-muted-foreground text-center max-w-sm text-sm mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Pehle thoda apne baare mein bataiye… phir milwa denge aapko aapke perfect companion se! 🌸
        </p>

        <button
          onClick={handleStart}
          className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold text-sm flex items-center gap-2 hover:shadow-glow transition-all hover:scale-105 active:scale-95 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          Chaliye Shuru Karte Hain <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-6 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <Sparkles className="w-3 h-3 text-gold-soft" />
          Bas 3 sawaal, phir ek pyaara surprise! 🎁
        </div>
      </div>
    );
  }

  // Reveal screen
  if (step === 4) {
    const firstAnswer = answers[0] || "";
    const revealLine = revealLines[firstAnswer] || "Main hoon Arjun — aapka virtual companion! 💕";

    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Floating hearts */}
        {["💕", "🌹", "💗", "✨", "🌸", "❤️", "💐", "🦋"].map((e, i) => (
          <FloatingEmoji key={i} emoji={e} delay={i * 0.8} left={5 + i * 12} />
        ))}

        <a href="/" className="absolute top-4 left-6 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Heart className="w-5 h-5 text-primary fill-primary animate-pulse-soft" />
          <span className="font-display text-xl font-semibold text-foreground">Mera Banda</span>
        </a>

        <div className="flex items-center gap-1 text-xs text-primary font-semibold mb-4 animate-fade-in-up">
          <Stars className="w-4 h-4 animate-pulse-soft" />
          Surprise! 🎉
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-110 animate-pulse-soft" />
          <img
            src={heroCharacter}
            alt="Arjun - Your virtual companion"
            className="w-56 h-56 object-contain relative z-10 drop-shadow-lg animate-fade-in-up"
          />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Miliye <span className="text-gradient">Arjun</span> se 💫
        </h1>
        <p className="text-foreground text-center max-w-sm text-sm font-medium mb-2 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {revealLine}
        </p>
        <p className="text-muted-foreground text-center max-w-xs text-xs mb-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          Aapka virtual companion jo hamesha aapke saath hai — har mood mein, har waqt 💕
        </p>

        <button
          onClick={() => navigate("/chat")}
          className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold text-sm flex items-center gap-2 hover:shadow-glow transition-all hover:scale-105 active:scale-95 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          Arjun se baat kariye 💬 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Question screens
  const currentQuestion = questions[step - 1];

  return (
    <div className={`min-h-screen gradient-hero flex flex-col items-center justify-center px-6 relative overflow-hidden transition-opacity duration-400 ${transitioning ? "opacity-0" : "opacity-100"}`}>
      <a href="/" className="absolute top-4 left-6 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
        <Heart className="w-5 h-5 text-primary fill-primary animate-pulse-soft" />
        <span className="font-display text-xl font-semibold text-foreground">Mera Banda</span>
      </a>

      {/* Floating emojis */}
      {["💗", "🌸", "✨"].map((e, i) => (
        <FloatingEmoji key={i} emoji={e} delay={i * 2} left={15 + i * 30} />
      ))}

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              i < step ? "bg-primary w-8" : i === step - 1 ? "bg-primary w-8" : "bg-border w-2.5"
            }`}
          />
        ))}
      </div>

      <div className="bg-card/80 backdrop-blur-md rounded-3xl shadow-dreamy border border-border p-6 md:p-8 max-w-md w-full animate-fade-in-up">
        <p className="text-xs text-muted-foreground mb-1 text-center">
          Sawaal {step} / {questions.length}
        </p>
        <h2 className="font-display text-lg md:text-xl font-bold text-foreground text-center mb-6">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(i)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left ${
                selectedOption === i
                  ? "gradient-card shadow-dreamy border-primary/30"
                  : "bg-card border-border hover:bg-accent/50"
              }`}
            >
              <span className="text-2xl shrink-0">{option.emoji}</span>
              <span className="text-sm font-medium text-foreground/80">{option.label}</span>
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
          {step === questions.length ? "Surprise dekhiye! 🎁" : "Aage chaliye →"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Welcome;
