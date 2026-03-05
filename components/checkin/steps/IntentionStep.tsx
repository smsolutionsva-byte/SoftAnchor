"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import SoftButton from "@/components/ui/SoftButton";

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

const MAX_CHARS = 120;

const IntentionStep = ({ onNext }: StepProps) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const setIntention = useAnchorStore((s) => s.setIntention);

  const handleSubmit = () => {
    setIntention(text.trim() || "just getting through today");
    onNext();
  };

  const handleSkip = () => {
    setIntention("just getting through today");
    onNext();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        width: "100%",
        maxWidth: "480px",
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
          What would make today feel okay?
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
          Not productive. Not perfect. Just... okay 🌸
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ width: "100%" }}
      >
        <textarea
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setText(e.target.value);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="even something tiny counts..."
          style={{
            width: "100%",
            minHeight: "100px",
            background: "var(--glass-bg)",
            border: `1px solid ${isFocused ? "var(--accent)" : "var(--glass-border)"}`,
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "16px",
            fontWeight: 400,
            padding: "16px 20px",
            outline: "none",
            resize: "none",
            transition: "border-color 0.3s ease",
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            textAlign: "right",
            marginTop: "8px",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--text-secondary)",
            fontWeight: 300,
          }}
        >
          {text.length} / {MAX_CHARS}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <SoftButton variant="primary" size="lg" onClick={handleSubmit}>
          Set my intention 💛
        </SoftButton>
        <button
          onClick={handleSkip}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 300,
            cursor: "pointer",
            padding: "8px",
            opacity: 0.7,
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.opacity = "0.7";
          }}
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
};

export default IntentionStep;
