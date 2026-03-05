"use client";

import { motion } from "motion/react";

interface StepIndicatorProps {
  total: number;
  current: number;
}

const StepIndicator = ({ total, current }: StepIndicatorProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "32px",
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isPast = i < current;

        return (
          <motion.div
            key={i}
            layout
            style={{
              height: 8,
              borderRadius: "var(--radius-full)",
              background: isActive || isPast ? "var(--accent)" : "var(--glass-border)",
              opacity: isPast ? 0.5 : 1,
            }}
            animate={{
              width: isActive ? 24 : 8,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 28,
            }}
          />
        );
      })}
    </div>
  );
};

export default StepIndicator;
