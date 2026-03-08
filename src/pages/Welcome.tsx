import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import heroCharacter from "@/assets/hero-character.png";
import { Heart, Sparkles, ArrowRight, Stars } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { playSwoosh, playChime } from "@/lib/sounds";

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
  const navigate = useNavigate();

  const fireConfetti = useCallback(() => {
    const colors = ["#e8748c", "#f5a0b3", "#ffd6e0", "#ff6b8a", "#c94c6e"];
    confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 }, colors, gravity: 0.6, scalar: 1.2 });
    setTimeout(() => {
      confetti({ particleCount: 50, spread: 120, origin: { y: 0.4 }, colors, gravity: 0.5, scalar: 1 });
    }, 300);
  }, []);

  const handleStart = () => {
    playSwoosh();
    setStep(1);
  };

  const handleOptionClick = (index: number) => {
    playTap();
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    playSwoosh();
    const currentQ = questions[step - 1];
    setAnswers((prev) => [...prev, currentQ.options[selectedOption].label]);
    setSelectedOption(null);
    setStep(step < questions.length ? step + 1 : 4);
  };

  useEffect(() => {
    if (step === 4) {
      playChime();
      fireConfetti();
      const timer = setTimeout(fireConfetti, 1200);
      return () => clearTimeout(timer);
    }
  }, [step, fireConfetti]);

  const floatingEmojis = ["💕", "🌹", "✨", "💗", "🦋", "🌸"];

  const pageVariants = {
    initial: { opacity: 0, scale: 0.96, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: -20 },
  };

  const pageTransition = { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const };

  const Logo = () => (
    <a href="/" className="absolute top-4 left-6 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity z-20">
      <Heart className="w-5 h-5 text-primary fill-primary animate-pulse-soft" />
      <span className="font-display text-xl font-semibold text-foreground">Mera Banda</span>
    </a>
  );

  return (
    <PageTransition>
      <div className="min-h-screen gradient-hero relative overflow-hidden">
        <Logo />
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="intro"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="min-h-screen flex flex-col items-center justify-center px-6"
            >
              {floatingEmojis.map((e, i) => (
                <FloatingEmoji key={i} emoji={e} delay={i * 1.5} left={10 + i * 15} />
              ))}

              <motion.div
                className="relative mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <div className="w-36 h-36 rounded-full bg-primary/15 flex items-center justify-center shadow-glow animate-pulse-soft">
                  <span className="text-6xl">💝</span>
                </div>
              </motion.div>

              <motion.h1
                className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Koi bahut special <span className="text-gradient">aapka intezaar</span> kar raha hai 💫
              </motion.h1>
              <motion.p
                className="text-muted-foreground text-center max-w-sm text-sm mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Pehle thoda apne baare mein bataiye… phir milwa denge aapko aapke perfect companion se! 🌸
              </motion.p>

              <motion.button
                onClick={handleStart}
                className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold text-sm flex items-center gap-2 hover:shadow-glow transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Chaliye Shuru Karte Hain <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.div
                className="flex items-center gap-1 text-xs text-muted-foreground mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Sparkles className="w-3 h-3 text-gold-soft" />
                Bas 3 sawaal, phir ek pyaara surprise! 🎁
              </motion.div>
            </motion.div>
          )}

          {step >= 1 && step <= 3 && (
            <motion.div
              key={`question-${step}`}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="min-h-screen flex flex-col items-center justify-center px-6"
            >
              {["💗", "🌸", "✨"].map((e, i) => (
                <FloatingEmoji key={i} emoji={e} delay={i * 2} left={15 + i * 30} />
              ))}

              <div className="hidden lg:flex gap-2 mb-8">
                {questions.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-2.5 rounded-full ${
                      i < step ? "bg-primary" : "bg-border"
                    }`}
                    animate={{ width: i < step ? 32 : 10 }}
                    transition={{ duration: 0.4 }}
                  />
                ))}
              </div>

              <motion.div
                className="bg-card/80 backdrop-blur-md rounded-3xl shadow-dreamy border border-border p-6 md:p-8 max-w-md w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-xs text-muted-foreground mb-1 text-center">
                  Sawaal {step} / {questions.length}
                </p>
                <h2 className="font-display text-lg md:text-xl font-bold text-foreground text-center mb-6">
                  {questions[step - 1].question}
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {questions[step - 1].options.map((option, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleOptionClick(i)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors text-left ${
                        selectedOption === i
                          ? "gradient-card shadow-dreamy border-primary/30"
                          : "bg-card border-border hover:bg-accent/50"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl shrink-0">{option.emoji}</span>
                      <span className="text-sm font-medium text-foreground/80">{option.label}</span>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className={`mt-6 w-full rounded-full py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                    selectedOption !== null
                      ? "bg-primary text-primary-foreground hover:shadow-glow"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  whileHover={selectedOption !== null ? { scale: 1.02 } : {}}
                  whileTap={selectedOption !== null ? { scale: 0.95 } : {}}
                >
                  {step === questions.length ? "Surprise dekhiye! 🎁" : "Aage chaliye"}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="reveal"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="min-h-screen flex flex-col items-center justify-center px-6"
            >
              {["💕", "🌹", "💗", "✨", "🌸", "❤️", "💐", "🦋"].map((e, i) => (
                <FloatingEmoji key={i} emoji={e} delay={i * 0.8} left={5 + i * 12} />
              ))}

              <motion.div
                className="flex items-center gap-1 text-xs text-primary font-semibold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Stars className="w-4 h-4 animate-pulse-soft" />
                Surprise! 🎉
              </motion.div>

              <motion.div
                className="relative mb-6"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.3 }}
              >
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-110 animate-pulse-soft" />
                <img
                  src={heroCharacter}
                  alt="Arjun - Your virtual companion"
                  className="w-56 h-56 object-contain relative z-10 drop-shadow-lg"
                />
              </motion.div>

              <motion.h1
                className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Miliye <span className="text-gradient">Arjun</span> se 💫
              </motion.h1>
              <motion.p
                className="text-foreground text-center max-w-sm text-sm font-medium mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {revealLines[answers[0]] || "Main hoon Arjun — aapka virtual companion! 💕"}
              </motion.p>
              <motion.p
                className="text-muted-foreground text-center max-w-xs text-xs mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Aapka virtual companion jo hamesha aapke saath hai — har mood mein, har waqt 💕
              </motion.p>

              <motion.button
                onClick={() => navigate("/chat")}
                className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold text-sm flex items-center gap-2 hover:shadow-glow transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                Arjun se baat kariye 💬 <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Welcome;
