"use client";

import { useState, useCallback } from "react";
import { motion, useAnimate } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";

const BrainDump = () => {
  const [text, setText] = useState("");
  const [isScattering, setIsScattering] = useState(false);
  const [scatteredChars, setScatteredChars] = useState<string[]>([]);
  const [scopeRef, animate] = useAnimate();
  const updateSession = useAnchorStore((s) => s.updateSession);

  const handleLetItGo = useCallback(async () => {
    if (!text.trim() || isScattering) return;

    updateSession({ brainDumpUsed: true });

    // Split text into characters for scatter effect
    const chars = text.split("");
    setScatteredChars(chars);
    setIsScattering(true);

    // Wait a tick for DOM to render chars
    await new Promise((r) => setTimeout(r, 50));

    // Animate each character
    if (scopeRef.current) {
      const charElements = scopeRef.current.querySelectorAll(".scatter-char");
      const animations = Array.from(charElements).map((el, i) => {
        const randomX = (Math.random() - 0.5) * 300;
        const randomY = -(Math.random() * 200 + 50);
        const randomRotate = (Math.random() - 0.5) * 360;

        return animate(
          el as HTMLElement,
          {
            x: randomX,
            y: randomY,
            opacity: 0,
            rotate: randomRotate,
            scale: 0.3,
          },
          {
            duration: 1.2,
            delay: i * 0.015,
            ease: [0.25, 0.46, 0.45, 0.94],
          }
        );
      });

      await Promise.all(animations);
    }

    // Reset after animation
    setText("");
    setScatteredChars([]);
    setIsScattering(false);
  }, [text, isScattering, animate, scopeRef, updateSession]);

  return (
    <div className="flex flex-col items-center gap-5">
      <p
        className="text-sm font-body text-center"
        style={{ color: "var(--text-secondary)" }}
      >
        pour it all out. nothing is saved, ever. 🫧
      </p>

      <div className="relative w-full" ref={scopeRef}>
        {!isScattering ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="what's swirling in your mind right now?..."
            className="w-full h-40 rounded-2xl p-4 text-sm font-body resize-none outline-none"
            style={{
              background: "var(--glass-bg)",
              color: "var(--text-primary)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />
        ) : (
          <div
            className="w-full h-40 rounded-2xl p-4 flex flex-wrap items-start content-start relative overflow-hidden"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            {scatteredChars.map((char, i) => (
              <span
                key={`${i}-${char}`}
                className="scatter-char inline-block text-sm font-body"
                style={{
                  color: "var(--text-primary)",
                  whiteSpace: "pre",
                }}
              >
                {char}
              </span>
            ))}
          </div>
        )}
      </div>

      <motion.button
        onClick={handleLetItGo}
        disabled={!text.trim() || isScattering}
        whileHover={{ scale: text.trim() ? 1.05 : 1 }}
        whileTap={{ scale: text.trim() ? 0.95 : 1 }}
        className="px-6 py-2.5 rounded-xl text-sm font-body cursor-pointer border-none"
        style={{
          background: text.trim() ? "var(--accent)" : "var(--glass-bg)",
          color: text.trim() ? "white" : "var(--text-muted)",
          opacity: isScattering ? 0.5 : 1,
        }}
      >
        {isScattering ? "letting go..." : "let it go 🍃"}
      </motion.button>

      <p
        className="text-xs font-body text-center"
        style={{ color: "var(--text-muted)", opacity: 0.6 }}
      >
        this text is never saved — it vanishes completely
      </p>
    </div>
  );
};

export default BrainDump;
