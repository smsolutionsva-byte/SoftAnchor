"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { BEDTIME_AFFIRMATIONS } from "@/lib/eveningLogic";

interface BedtimeAffirmationProps {
  onClose: () => void;
}

const BedtimeAffirmation = ({ onClose }: BedtimeAffirmationProps) => {
  const affirmation = useMemo(
    () =>
      BEDTIME_AFFIRMATIONS[
        Math.floor(Math.random() * BEDTIME_AFFIRMATIONS.length)
      ],
    []
  );

  const words = affirmation.split(" ");
  const [dimOpacity, setDimOpacity] = useState(0);
  const [showClose, setShowClose] = useState(false);

  // Gradual dim over 4 seconds
  useEffect(() => {
    const start = Date.now();
    const duration = 4000;

    const frame = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setDimOpacity(progress * 0.4);

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);

    // Show close button after 5 seconds
    const timer = setTimeout(() => setShowClose(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Dimming overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "black",
          opacity: dimOpacity,
          pointerEvents: "none",
          zIndex: 0,
          transition: "opacity 0.1s linear",
        }}
      />

      {/* Affirmation word by word */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.3,
              type: "tween",
            }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Goodnight message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{
          duration: 1,
          delay: words.length * 0.3 + 0.5,
          type: "tween",
        }}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "rgba(255,255,255,0.5)",
          fontStyle: "italic",
          position: "relative",
          zIndex: 1,
        }}
      >
        goodnight, soft one 🌙
      </motion.p>

      {/* Close button — delayed 5s */}
      {showClose && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.6, type: "tween" }}
          onClick={onClose}
          style={{
            marginTop: "32px",
            padding: "8px 20px",
            borderRadius: "9999px",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
          }}
        >
          close gently
        </motion.button>
      )}
    </div>
  );
};

export default BedtimeAffirmation;
