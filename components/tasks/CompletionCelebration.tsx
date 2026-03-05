"use client";

import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { getRandom, GENTLE_COPY } from "@/lib/gentleLanguage";

interface CompletionCelebrationProps {
  taskTitle: string;
  onDismiss: () => void;
}

const CompletionCelebration = ({
  taskTitle,
  onDismiss,
}: CompletionCelebrationProps) => {
  const celebrationMessage = useMemo(
    () => getRandom(GENTLE_COPY.taskStatus.completed),
    []
  );

  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      targetX: (Math.random() - 0.5) * 600,
      targetY: (Math.random() - 0.5) * 600,
      size: 4 + Math.random() * 8,
      duration: 1.5 + Math.random() * 1,
      color:
        i % 3 === 0
          ? "var(--accent)"
          : i % 3 === 1
            ? "rgba(255,255,255,0.8)"
            : "var(--accent-soft)",
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(), 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--bg-primary)",
          opacity: 0.8,
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.targetX,
            y: p.targetY,
            opacity: [1, 1, 0],
            scale: [0, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            type: "tween",
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Center message */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
        }}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          zIndex: 1,
        }}
      >
        {/* Pulsing ring */}
        <div style={{ position: "relative" }}>
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: 2,
              type: "tween",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              inset: -16,
              border: "2px solid var(--accent)",
              borderRadius: "50%",
            }}
          />
          <span style={{ fontSize: "72px", lineHeight: 1, display: "block" }}>
            ✨
          </span>
        </div>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "28px",
            fontWeight: 400,
            color: "var(--accent)",
            textAlign: "center",
            maxWidth: "360px",
          }}
        >
          {celebrationMessage}
        </p>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            fontWeight: 300,
            color: "var(--text-secondary)",
            textAlign: "center",
          }}
        >
          {taskTitle}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CompletionCelebration;
