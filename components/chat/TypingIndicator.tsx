"use client";

import { motion, AnimatePresence } from "motion/react";
import type { ITypingUser } from "@/types/chat";

interface TypingIndicatorProps {
  typingLabel: string;
  typingUsers: ITypingUser[];
}

const dotStyle: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#6366f1",
};

const typingContainerStyle: React.CSSProperties = {
  padding: "8px 32px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
};

function TypingDots() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "4px",
        width: "32px",
        height: "20px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={dotStyle}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function TypingIndicator({
  typingLabel,
  typingUsers,
}: TypingIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      {typingUsers.length > 0 && (
        <motion.div
          key="typing"
          initial={{ opacity: 0, y: 8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: 4, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={typingContainerStyle}
        >
          <TypingDots />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-secondary)",
              fontStyle: "italic",
            }}
          >
            {typingLabel}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
