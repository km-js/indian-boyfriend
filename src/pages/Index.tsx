import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { startBgMusic, stopBgMusic, isBgMusicPlaying } from "@/lib/sounds";
import heroCharacter from "@/assets/hero-character.png";
import arjunSad from "@/assets/arjun-sad.png";
import arjunHappy from "@/assets/arjun-happy.png";
import arjunAnxious from "@/assets/arjun-anxious.png";
import arjunAngry from "@/assets/arjun-angry.png";
import arjunBored from "@/assets/arjun-bored.png";
import arjunHeartbroken from "@/assets/arjun-heartbroken.png";
import arjunSleep from "@/assets/arjun-sleep.png";
import arjunHug from "@/assets/arjun-hug.png";
import EmotionButton from "@/components/EmotionButton";
import ChatBubble from "@/components/ChatBubble";
import { emotions } from "@/data/responses";
import { Heart, Sparkles, Send, Music, VolumeX } from "lucide-react";

const emotionImages = [
  arjunSad,
  arjunHappy,
  arjunAnxious,
  arjunAngry,
  arjunBored,
  arjunHeartbroken,
  arjunSleep,
  arjunHug,
];

const emotionCaptions = [
  "Ye flowers aapke liye… please smile kar dijiye 🌹",
  "Yaaay! Chaliye celebrate karte hain! 🎉",
  "Shhh… sab theek hai, main hoon na 🫂",
  "Chaliye chai peete hain saath mein ☕",
  "Bore mat hoiye, dekhiye masti! ✌️",
  "Ye dil sirf aapke liye hai 💝",
  "Main story sunata hoon, so jaiye 📖",
  "Lijiye bahut bada waala hug! 🤗",
];

const Index = () => {
  const [activeEmotion, setActiveEmotion] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ text: string; isCharacter: boolean }[]>([
    { text: "Hey! 🌸 Main hoon Arjun. Aapka virtual companion. Bataiye, aaj kaisa feel ho raha hai?", isCharacter: true },
  ]);
  const [userInput, setUserInput] = useState("");
  const [currentImage, setCurrentImage] = useState(heroCharacter);
  const [imageCaption, setImageCaption] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const [musicOn, setMusicOn] = useState(false);

  const toggleMusic = () => {
    if (isBgMusicPlaying()) {
      stopBgMusic();
      setMusicOn(false);
    } else {
      startBgMusic();
      setMusicOn(true);
    }
  };

  useEffect(() => {
    return () => { stopBgMusic(); };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEmotionClick = (index: number) => {
    setActiveEmotion(index);
    setCurrentImage(emotionImages[index]);
    setImageCaption(emotionCaptions[index]);
    
    const emotion = emotions[index];
    const randomResponse = emotion.responses[Math.floor(Math.random() * emotion.responses.length)];

    setMessages((prev) => [
      ...prev,
      { text: `I'm feeling ${emotion.label.toLowerCase()}… ${emotion.emoji}`, isCharacter: false },
      { text: randomResponse, isCharacter: true },
    ]);
    
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    const greetings = [
      "Aww, main samajh sakta hoon 🫂 Aap bahut strong hain!",
      "Haan bataiye aur, main sun raha hoon… 💕",
      "Aapke liye hamesha time hai mere paas. Aap special hain ✨",
      "Jo bhi ho, hum saath mein handle karenge. Promise! 🤝💫",
      "Aapki baatein sunke mujhe accha lagta hai. Aur bataiye! 🌸",
    ];
    const response = greetings[Math.floor(Math.random() * greetings.length)];
    setMessages((prev) => [
      ...prev,
      { text: userInput, isCharacter: false },
      { text: response, isCharacter: true },
    ]);
    setUserInput("");
    
  };

  return (
    <PageTransition>
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-4">
        <a href="/" className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary" />
          <span className="font-display text-base sm:text-xl font-semibold text-foreground">
            Mera Banda
          </span>
        </a>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggleMusic}
            className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-muted-foreground bg-card/60 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-border hover:bg-accent/50 transition-all"
          >
            {musicOn ? <Music className="w-3 h-3 text-primary" /> : <VolumeX className="w-3 h-3" />}
            {musicOn ? "🎵" : "Off"}
          </button>
          <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-gold-soft" />
            Always here for you
          </span>
        </div>
      </header>

      {/* Emotion Buttons */}
      <section className="px-2 sm:px-4 pb-2 sm:pb-4">
        <div className="flex flex-nowrap justify-start sm:justify-center gap-1 sm:gap-2 max-w-4xl mx-auto overflow-x-auto pb-1.5 scrollbar-hide px-1">
          {emotions.map((emotion, i) => (
            <EmotionButton
              key={emotion.label}
              emoji={emotion.emoji}
              label={emotion.labelHi}
              onClick={() => handleEmotionClick(i)}
              active={activeEmotion === i}
            />
          ))}
        </div>
      </section>

      {/* Arjun + Chat Side by Side */}
      <section className="px-2 sm:px-4 pb-4 sm:pb-8 max-w-5xl mx-auto flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-6 items-center md:items-stretch flex-1">
          {/* Arjun Character - smaller on mobile */}
          <div className="flex flex-col items-center justify-center md:w-2/5 shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-110" />
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt="Arjun - Your virtual companion"
                  className="w-28 h-28 sm:w-44 sm:h-44 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-lg"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </AnimatePresence>
            </div>
            {imageCaption ? (
              <p className="mt-2 text-xs sm:text-sm font-semibold text-primary animate-fade-in-up text-center">
                {imageCaption}
              </p>
            ) : (
              <>
                <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-center mt-2 sm:mt-4 text-foreground">
                  Hey Beautiful! <span className="text-gradient">I'm Arjun</span> 💫
                </h1>
                <p className="text-muted-foreground text-center mt-1 sm:mt-2 max-w-xs text-xs sm:text-sm">
                  Aapka virtual companion jo hamesha aapke saath hai 💕
                </p>
              </>
            )}
          </div>

          {/* Chat Section */}
          <div className="w-full md:w-3/5 bg-card/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-dreamy border border-border overflow-hidden flex flex-col min-h-[280px] sm:min-h-0">
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-border flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
              <span className="text-[10px] sm:text-xs font-semibold text-foreground">Arjun is online</span>
            </div>

            <div
              ref={chatRef}
              className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 flex-1 max-h-[50vh] sm:max-h-96 overflow-y-auto scroll-smooth"
            >
              {messages.map((msg, i) => (
                <ChatBubble key={i} message={msg.text} isCharacter={msg.isCharacter} />
              ))}
            </div>

            {/* Input */}
            <div className="p-2 sm:p-3 border-t border-border flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Kuch bhi boliye… 💬"
                className="flex-1 bg-muted/50 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary text-primary-foreground rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:shadow-glow transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-3 sm:py-6 text-[10px] sm:text-xs text-muted-foreground">
        Made with 💕 for you — because you deserve to feel special
      </footer>
    </div>
    </PageTransition>
  );
};

export default Index;
