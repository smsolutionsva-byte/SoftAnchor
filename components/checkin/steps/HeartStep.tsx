"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import type { HeartState } from "@/types";

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

const OPTIONS: {
  value: HeartState;
  emoji: string;
  label: string;
  desc: string;
}[] = [
  {
    value: "heavy",
    emoji: "🌧️",
    label: "heavy",
    desc: "carrying something today",
  },
  {
    value: "okay",
    emoji: "🌤️",
    label: "okay",
    desc: "not great, not bad, just okay",
  },
  {
    value: "light",
    emoji: "☀️",
    label: "light",
    desc: "open, warm, feeling good",
  },
];

const HeartStep = ({ onNext }: StepProps) => {
  const [selected, setSelected] = useState<HeartState | null>(null);
  const setNervousSystemState = useAnchorStore(
    (s) => s.setNervousSystemState
  );

  const handleSelect = (value: HeartState) => {
    setSelected(value);
    setNervousSystemState("heart", value);
    setTimeout(() => onNext(), 380);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 400,
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          How does your heart feel?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            color: "var(--text-secondary)",
            fontWeight: 300,
          }}
        >
          Be honest. This is just between you and your anchor 💜
        </motion.p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(opt.value)}
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: isSelected
                  ? "2px solid var(--accent)"
                  : "1px solid var(--glass-border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: isSelected
                  ? "0 0 0 2px var(--accent), 0 0 20px var(--accent-soft)"
                  : "0 8px 32px var(--shadow)",
                padding: "24px",
                minWidth: "140px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                outline: "none",
                transform: isSelected ? "scale(1.05)" : undefined,
                transition: "var(--transition-soft)",
              }}
            >
              <span style={{ fontSize: "48px", lineHeight: 1 }}>
                {opt.emoji}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {opt.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 300,
                  color: "var(--text-secondary)",
                  maxWidth: "140px",
                  lineHeight: 1.4,
                }}
              >
                {opt.desc}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default HeartStep;
