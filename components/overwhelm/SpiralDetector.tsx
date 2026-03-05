"use client";

import { motion, AnimatePresence } from "motion/react";
import useSpiralDetector from "@/hooks/useSpiralDetector";
import { getSpiralMessage } from "@/lib/spiralDetection";
import { useAnchorStore } from "@/store/useAnchorStore";
import { useMemo } from "react";

const SpiralDetector = () => {
  const { spiralDetected, dismissSpiral } = useSpiralDetector();
  const setSanctuaryOpen = useAnchorStore((s) => s.setSanctuaryOpen);
  const startSession = useAnchorStore((s) => s.startSession);

  const message = useMemo(() => getSpiralMessage(), []);

  const handlePause = () => {
    dismissSpiral();
    startSession();
    setSanctuaryOpen(true);
  };

  const handleContinue = () => {
    dismissSpiral();
  };

  return (
    <AnimatePresence>
      {spiralDetected && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 22,
          }}
          className="fixed bottom-20 right-6 z-[60] w-72 rounded-2xl p-5"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--glass-border)",
            boxShadow: "0 20px 40px -8px rgba(0,0,0,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <p
            className="text-sm font-display font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {message.title}
          </p>
          <p
            className="text-xs font-body mb-4 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {message.body}
          </p>

          <div className="flex gap-2">
            <button
              onClick={handlePause}
              className="flex-1 py-2 rounded-xl text-xs font-body cursor-pointer border-none"
              style={{
                background: "var(--accent)",
                color: "white",
              }}
            >
              {message.pauseLabel}
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-2 rounded-xl text-xs font-body cursor-pointer"
              style={{
                background: "transparent",
                color: "var(--text-muted)",
                border: "1px solid var(--glass-border)",
              }}
            >
              {message.continueLabel}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpiralDetector;
