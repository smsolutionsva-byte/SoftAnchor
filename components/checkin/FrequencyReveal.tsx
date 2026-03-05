"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { getFrequency } from "@/lib/frequencies";
import { getAffirmationForFrequency } from "@/lib/affirmations";
import GlassCard from "@/components/ui/GlassCard";
import SoftButton from "@/components/ui/SoftButton";
import useStreaks from "@/hooks/useStreaks";
import type { BodyState, MindState, HeartState } from "@/types";

interface FrequencyRevealProps {
  onComplete: () => void;
}

const FrequencyReveal = ({ onComplete }: FrequencyRevealProps) => {
  const nervousSystem = useAnchorStore((s) => s.nervousSystem);
  const setCurrentFrequency = useAnchorStore((s) => s.setCurrentFrequency);
  const setTheme = useAnchorStore((s) => s.setTheme);
  const setCheckInCompleted = useAnchorStore((s) => s.setCheckInCompleted);

  const [showName, setShowName] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const frequency = useMemo(() => {
    return getFrequency(
      nervousSystem.body as BodyState,
      nervousSystem.mind as MindState,
      nervousSystem.heart as HeartState
    );
  }, [nervousSystem]);

  const affirmation = useMemo(() => {
    return getAffirmationForFrequency(frequency);
  }, [frequency]);

  useEffect(() => {
    // Phase 1: immediate — orb pulse
    // Phase 2: reveal frequency name
    setCurrentFrequency(frequency);
    setTheme(frequency.theme);
    setCheckInCompleted();

    const t1 = setTimeout(() => setShowName(true), 1000);
    const t2 = setTimeout(() => setShowTagline(true), 1500);
    const t3 = setTimeout(() => setShowMessage(true), 2000);
    const t4 = setTimeout(() => setShowButton(true), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log checkin win
  const { logWin } = useStreaks();

  const handleBeginDay = () => {
    logWin("checkin");
    setFadeOut(true);
    setTimeout(() => onComplete(), 600);
  };

  return (
    <motion.div
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        gap: "24px",
      }}
    >
      {/* Phase 1: Pulsing orb */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 1.2,
          type: "tween",
          ease: "easeOut",
        }}
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: frequency.color,
          filter: "blur(1px)",
          boxShadow: `0 0 60px ${frequency.color}40, 0 0 120px ${frequency.color}20`,
        }}
      />

      {/* Phase 2: Frequency name */}
      {showName && (
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "52px",
            fontWeight: 400,
            color: "var(--accent)",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {frequency.name}
        </motion.h1>
      )}

      {/* Phase 3: Emoji + tagline */}
      {showTagline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            style={{ fontSize: "48px", lineHeight: 1 }}
          >
            {frequency.emoji}
          </motion.span>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "var(--text-secondary)",
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            {frequency.tagline}
          </p>
        </motion.div>
      )}

      {/* Phase 4: Welcome message + affirmation */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <GlassCard padding="32px" delay={0}>
            <div
              style={{
                maxWidth: "480px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "var(--text-primary)",
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {frequency.welcomeMessage}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  lineHeight: 1.5,
                }}
              >
                &ldquo;{affirmation}&rdquo;
              </p>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Phase 5: Begin day button */}
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <SoftButton variant="primary" size="lg" onClick={handleBeginDay}>
            Begin my day softly →
          </SoftButton>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FrequencyReveal;
