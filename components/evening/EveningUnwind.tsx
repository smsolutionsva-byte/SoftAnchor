"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { getEveningGreeting } from "@/lib/eveningLogic";
import ReflectionStep from "./steps/ReflectionStep";
import GlowMapStep from "./steps/GlowMapStep";
import TomorrowWhisper from "./steps/TomorrowWhisper";
import BedtimeAffirmation from "./BedtimeAffirmation";

interface EveningUnwindProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = ["reflection", "glowmap", "tomorrow", "bedtime"] as const;
type Step = (typeof STEPS)[number];

const EveningUnwind = ({ open, onClose }: EveningUnwindProps) => {
  const [step, setStep] = useState<Step>("reflection");
  const updateEveningSession = useAnchorStore((s) => s.updateEveningSession);
  const greeting = getEveningGreeting();

  const nextStep = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
    }
  }, [step]);

  const handleComplete = useCallback(() => {
    updateEveningSession({ completedAt: new Date().toISOString() });
    onClose();
    setStep("reflection");
  }, [updateEveningSession, onClose]);

  const handleSkip = useCallback(() => {
    updateEveningSession({ skipped: true });
    onClose();
    setStep("reflection");
  }, [updateEveningSession, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, type: "tween" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(20px)",
            padding: "24px",
          }}
        >
          {/* Skip button */}
          <motion.button
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
            transition={{ delay: 1, type: "tween" }}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "rgba(255,255,255,0.5)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            skip for tonight →
          </motion.button>

          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "tween" }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              color: "rgba(255,255,255,0.8)",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            {greeting}
          </motion.p>

          {/* Step indicator */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            {STEPS.slice(0, 3).map((s, i) => (
              <div
                key={s}
                style={{
                  width: "40px",
                  height: "3px",
                  borderRadius: "2px",
                  background:
                    STEPS.indexOf(step) >= i
                      ? "var(--orb-1)"
                      : "rgba(255,255,255,0.15)",
                  transition: "background 0.4s",
                }}
              />
            ))}
          </div>

          {/* Steps */}
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
            }}
          >
            <AnimatePresence mode="wait">
              {step === "reflection" && (
                <motion.div
                  key="reflection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, type: "tween" }}
                >
                  <ReflectionStep onNext={nextStep} />
                </motion.div>
              )}
              {step === "glowmap" && (
                <motion.div
                  key="glowmap"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, type: "tween" }}
                >
                  <GlowMapStep onNext={nextStep} />
                </motion.div>
              )}
              {step === "tomorrow" && (
                <motion.div
                  key="tomorrow"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, type: "tween" }}
                >
                  <TomorrowWhisper onNext={nextStep} />
                </motion.div>
              )}
              {step === "bedtime" && (
                <motion.div
                  key="bedtime"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, type: "tween" }}
                >
                  <BedtimeAffirmation onClose={handleComplete} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EveningUnwind;
