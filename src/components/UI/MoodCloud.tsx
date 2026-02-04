'use client'
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingItem {
  id: number;
  text: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  delay: number;
  duration: number;
  type: "text" | "emoji" | "hashtag";
}

// Reduced list for performance optimization
const sianTexts = [
  "wah everyday same routine…",
  "no time… no energy…",
  "kids also tired lor 😭",
  "deadline… assignment… repeat",
  "so many things to juggle",
  "why everyday so busy 😵‍💫",
  "need a break lah",
  "everyday so damn hot sia",
  "just want to relax…",
  "sooooo sian...",
  "wan kopi but wan holiday more",
];

const emojis = ["😵‍💫", "😭", "😮‍💨", "😩", "🤯", "🤸‍♂️", "🏖️", "✈️", "🌴"];

const hashtags = ["#helpme", "#needabreak", "#burnout", "#sian", "#tiredlah"];

const MoodCloud: React.FC = () => {
  const [phase, setPhase] = useState<"floating" | "finale" | "shiok" | "cleanup">("floating");
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [shiokText, setShiokText] = useState("#SHI");
  const [shiokExpanding, setShiokExpanding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random floating items
  useEffect(() => {
    const generateItems = (): FloatingItem[] => {
      const allItems: FloatingItem[] = [];
      let id = 0;

      // Add texts
      sianTexts.forEach((text, i) => {
        allItems.push({
          id: id++,
          text,
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          scale: 0.8 + Math.random() * 0.4,
          rotation: (Math.random() - 0.5) * 20,
          delay: i * 0.15,
          duration: 2 + Math.random() * 2,
          type: "text",
        });
      });

      // Add emojis
      emojis.forEach((emoji, i) => {
        allItems.push({
          id: id++,
          text: emoji,
          x: Math.random() * 85 + 7.5,
          y: Math.random() * 70 + 15,
          scale: 1 + Math.random() * 0.5,
          rotation: (Math.random() - 0.5) * 30,
          delay: i * 0.12 + 0.3,
          duration: 2.5 + Math.random() * 1.5,
          type: "emoji",
        });
      });

      // Add hashtags
      hashtags.forEach((tag, i) => {
        allItems.push({
          id: id++,
          text: tag,
          x: Math.random() * 75 + 12.5,
          y: Math.random() * 65 + 17.5,
          scale: 0.7 + Math.random() * 0.3,
          rotation: (Math.random() - 0.5) * 15,
          delay: i * 0.2 + 0.8,
          duration: 2 + Math.random() * 2,
          type: "hashtag",
        });
      });

      return allItems;
    };

    setItems(generateItems());
  }, []);

  useEffect(() => {
    const runAnimation = () => {
      setPhase("floating");
      setShiokText("#SHI");
      setShiokExpanding(false);

      // 1. Shortened delay for finale appearance
      const finaleTimer = setTimeout(() => {
        setPhase("finale");
      }, 3800);

      // 2. Adjust Shiok appearance relative to finale
      const shiokTimer = setTimeout(() => {
        setPhase("shiok");
        setShiokExpanding(true);
      }, 5000);

      // 3. Expansion ends at ~6520ms (5000 + 1520). 
      // Pause for 1s after expansion => 7520ms.
      // Then fade out (change phase to cleanup).
      const fadeOutTimer = setTimeout(() => {
         setPhase("cleanup");
      }, 7520);

      // 4. Fade animation takes ~0.5s => ends at 8020ms.
      // Wait another 2s pause => 10020ms.
      // Restart loop.
      const loopTimer = setTimeout(() => {
        setItems((prev) =>
          prev.map((item) => ({
            ...item,
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20,
            delay: Math.random() * 1.5,
          }))
        );
        runAnimation();
      }, 10020);

      return () => {
        clearTimeout(finaleTimer);
        clearTimeout(shiokTimer);
        clearTimeout(fadeOutTimer);
        clearTimeout(loopTimer);
      };
    };

    const cleanup = runAnimation();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!shiokExpanding) return;

    const baseText = "#SHI";
    let oCount = 1;
    let kCount = 0;
    const maxOs = 12;
    const maxKs = 8;

    const expandInterval = setInterval(() => {
      if (oCount < maxOs) {
        oCount++;
        setShiokText(baseText + "O".repeat(oCount) + "K".repeat(kCount));
      } else if (kCount < maxKs) {
        kCount++;
        setShiokText(baseText + "O".repeat(oCount) + "K".repeat(kCount));
      } else {
        clearInterval(expandInterval);
      }
    }, 80);

    return () => clearInterval(expandInterval);
  }, [shiokExpanding]);

  const getItemColor = (type: string) => {
    switch (type) {
      case "text":
        return "text-brand-navy";
      case "emoji":
        return "";
      case "hashtag":
        return "text-brand-teal";
      default:
        return "text-brand-navy";
    }
  };

  const bounceTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 10,
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280px] md:h-[320px] overflow-hidden bg-white mt-16 md:mt-24 mb-4 select-none pointer-events-none"
    >
      {/* Floating items phase */}
      <AnimatePresence>
        {phase === "floating" && (
          <motion.div
            key="floating-container"
            className="absolute inset-0 w-full h-full"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                className={`absolute font-semibold whitespace-nowrap will-change-[transform,opacity] ${getItemColor(item.type)} ${
                  item.type === "emoji"
                    ? "text-2xl md:text-3xl"
                    : item.type === "hashtag"
                      ? "text-sm md:text-base font-medium bg-brand-teal/10 px-2 py-1 rounded-full"
                      : "text-base md:text-lg"
                }`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: item.rotation - 20,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, item.scale * 1.2, item.scale, 0.5],
                  rotate: [item.rotation - 20, item.rotation + 10, item.rotation - 5, item.rotation],
                  y: [20, -15, -25, -40],
                }}
                transition={{
                  duration: item.duration,
                  delay: item.delay,
                  ease: [0.34, 1.56, 0.64, 1],
                  times: [0, 0.3, 0.7, 1],
                }}
              >
                {item.text}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finale phase - "Time for a TRIP..." */}
      <AnimatePresence>
        {(phase === "finale" || phase === "shiok") && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            style={{ paddingBottom: '40px' }} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-2xl md:text-4xl font-bold text-brand-navy text-center flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={bounceTransition}
            >
              <span>
                Time for a <span className="text-brand-coral">TRIP</span>...
              </span>
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, scale: 0, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ ...bounceTransition, delay: 0.2 }}
              >
                😏
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "shiok" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            style={{ paddingTop: "140px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-5xl md:text-8xl lg:text-9xl font-black text-brand-green tracking-wider whitespace-nowrap drop-shadow-sm"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={bounceTransition}
            >
              {shiokText}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle decorative elements */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-brand-coral/30 rounded-full" />
      <div className="absolute top-12 right-8 w-3 h-3 bg-brand-teal/20 rounded-full" />
      <div className="absolute bottom-8 left-12 w-2 h-2 bg-brand-green/30 rounded-full" />
      <div className="absolute bottom-16 right-16 w-1.5 h-1.5 bg-brand-coral/40 rounded-full" />
    </div>
  );
};

export default MoodCloud;
