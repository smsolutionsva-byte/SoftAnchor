"use client";

import { motion, AnimatePresence } from "motion/react";
import type { BreathingPhase } from "@/types";

interface BreathingPhaseLabelProps {
  phase: BreathingPhase;
  label: string;
  currentCycle: number;
  totalCycles: number;
}

const BreathingPhaseLabel = ({
  phase,
  label,
  currentCycle,
  totalCycles,
}: BreathingPhaseLabelProps) => {
  const showCycleCounter =
    phase !== "idle" && phase !== "complete" && totalCycles > 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-lg font-body"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </motion.p>
      </AnimatePresence>

      {showCycleCounter && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="text-xs font-body"
          style={{ color: "var(--text-muted)" }}
        >
          cycle {currentCycle} of {totalCycles}
        </motion.p>
      )}
    </div>
  );
};

export default BreathingPhaseLabel;
