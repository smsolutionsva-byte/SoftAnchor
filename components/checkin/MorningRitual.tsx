"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import BodyStep from "./steps/BodyStep";
import MindStep from "./steps/MindStep";
import HeartStep from "./steps/HeartStep";
import IntentionStep from "./steps/IntentionStep";
import FrequencyReveal from "./FrequencyReveal";
import StepIndicator from "./StepIndicator";

interface MorningRitualProps {
  onComplete: () => void;
}

const TOTAL_STEPS = 4;

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const MorningRitual = ({ onComplete }: MorningRitualProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showReveal, setShowReveal] = useState(false);

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      // All steps done, show frequency reveal
      setShowReveal(true);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  if (showReveal) {
    return <FrequencyReveal onComplete={onComplete} />;
  }

  const steps = [
    <BodyStep key="body" onNext={handleNext} onBack={undefined} />,
    <MindStep key="mind" onNext={handleNext} onBack={handleBack} />,
    <HeartStep key="heart" onNext={handleNext} onBack={handleBack} />,
    <IntentionStep key="intention" onNext={handleNext} onBack={handleBack} />,
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        gap: "16px",
      }}
    >
      {/* Greeting */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "18px",
          color: "var(--text-secondary)",
          marginBottom: "24px",
        }}
      >
        good morning, soft one ✨
      </motion.p>

      {/* Step content with AnimatePresence */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          minHeight: "320px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
            }}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {steps[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step indicator */}
      <StepIndicator total={TOTAL_STEPS} current={currentStep} />
    </div>
  );
};

export default MorningRitual;
