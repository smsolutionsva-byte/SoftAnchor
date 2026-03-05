"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Badge } from "@/types";

interface MilestoneCelebrationProps {
  badge: Badge | null;
  onDismiss: () => void;
}

const MilestoneCelebration = ({
  badge,
  onDismiss,
}: MilestoneCelebrationProps) => {
  const [phase, setPhase] = useState(0);

  // 5-phase staggered entrance
  useEffect(() => {
    if (!badge) return;
    setPhase(0);

    const timers = [
      setTimeout(() => setPhase(1), 0), // emoji
      setTimeout(() => setPhase(2), 500), // name
      setTimeout(() => setPhase(3), 1000), // description
      setTimeout(() => setPhase(4), 1500), // message word-by-word
      setTimeout(() => setPhase(5), 3000), // dismiss button
    ];

    // Auto-dismiss after 8s
    const autoDismiss = setTimeout(onDismiss, 8000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(autoDismiss);
    };
  }, [badge, onDismiss]);

  // Particles
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 6,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
        color:
          i % 3 === 0
            ? "var(--orb-1)"
            : i % 3 === 1
              ? "var(--orb-2)"
              : "var(--accent)",
      })),
    []
  );

  // Split message into words
  const messageWords = badge?.message.split(" ") ?? [];

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, type: "tween" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(16px)",
          }}
          onClick={onDismiss}
        >
          {/* Slow particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.color,
                opacity: 0,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                type: "tween",
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Phase 1: Emoji */}
          {phase >= 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "tween" }}
              style={{ fontSize: "64px", marginBottom: "16px" }}
            >
              {badge.emoji}
            </motion.div>
          )}

          {/* Phase 2: Name */}
          {phase >= 2 && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, type: "tween" }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 600,
                color: "white",
                margin: "0 0 8px 0",
              }}
            >
              {badge.name}
            </motion.h2>
          )}

          {/* Phase 3: Description */}
          {phase >= 3 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, type: "tween" }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                margin: "0 0 20px 0",
              }}
            >
              {badge.description}
            </motion.p>
          )}

          {/* Phase 4: Message word-by-word */}
          {phase >= 4 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "6px",
                maxWidth: "320px",
                marginBottom: "24px",
              }}
            >
              {messageWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.15,
                    type: "tween",
                  }}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          )}

          {/* Phase 5: Dismiss */}
          {phase >= 5 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, type: "tween" }}
              onClick={onDismiss}
              style={{
                padding: "8px 20px",
                borderRadius: "9999px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                cursor: "pointer",
              }}
            >
              continue ✨
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MilestoneCelebration;
