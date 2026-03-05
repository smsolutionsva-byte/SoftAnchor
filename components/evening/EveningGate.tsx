"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import useEveningUnwind from "@/hooks/useEveningUnwind";

interface EveningGateProps {
  onOpen: () => void;
}

const EveningGate = ({ onOpen }: EveningGateProps) => {
  const { shouldPromptEvening: shouldPrompt, dismissPrompt: dismiss } = useEveningUnwind();
  const [visible, setVisible] = useState(true);

  if (!shouldPrompt || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 2, type: "tween" }}
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          zIndex: 100,
          maxWidth: "320px",
          background: "var(--glass-bg)",
          borderRadius: "16px",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(16px)",
          padding: "20px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: "0 0 6px 0",
          }}
        >
          🌙 Hey, it&apos;s evening
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: "0 0 16px 0",
          }}
        >
          Whenever you&apos;re ready, let&apos;s gently close the day together.
        </p>

        <div style={{ display: "flex", gap: "8px" }}>
          <motion.button
            onClick={onOpen}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 500,
              border: "none",
              background: "var(--orb-1)",
              color: "white",
              cursor: "pointer",
            }}
          >
            Begin unwind ✨
          </motion.button>
          <motion.button
            onClick={() => {
              dismiss();
              setVisible(false);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              border: "1px solid var(--glass-border)",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            Not yet
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EveningGate;
