"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { REFLECTION_PROMPTS } from "@/lib/eveningLogic";

interface ReflectionStepProps {
  onNext: () => void;
}

const ReflectionStep = ({ onNext }: ReflectionStepProps) => {
  const prompt = useMemo(
    () =>
      REFLECTION_PROMPTS[
        Math.floor(Math.random() * REFLECTION_PROMPTS.length)
      ],
    []
  );
  const [text, setText] = useState("");
  const updateEveningSession = useAnchorStore((s) => s.updateEveningSession);

  const handleNext = () => {
    if (text.trim()) {
      updateEveningSession({ reflectionText: text.trim() });
    }
    onNext();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "18px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.85)",
          marginBottom: "20px",
        }}
      >
        {prompt}
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="whatever comes to mind... or skip this"
        rows={4}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "16px",
          borderRadius: "12px",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "rgba(255,255,255,0.9)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          outline: "none",
          resize: "none",
          marginBottom: "20px",
        }}
      />

      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          padding: "10px 24px",
          borderRadius: "12px",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 500,
          border: "none",
          background: "var(--orb-1)",
          color: "white",
          cursor: "pointer",
        }}
      >
        {text.trim() ? "next →" : "skip →"}
      </motion.button>
    </div>
  );
};

export default ReflectionStep;
