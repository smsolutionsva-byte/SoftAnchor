"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoadingOrb from "@/components/ui/LoadingOrb";
import { GENTLE_COPY } from "@/lib/gentleLanguage";

interface TaskBreakdownModalProps {
  isOpen: boolean;
  task: string;
  onClose: () => void;
}

const TaskBreakdownModal = ({
  isOpen,
  task,
  onClose,
}: TaskBreakdownModalProps) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex(
        (prev) => (prev + 1) % GENTLE_COPY.breakdown.loading.length
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={onClose}
        >
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: 400,
              width: "100%",
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 8px 32px var(--shadow)",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <LoadingOrb size={60} />

            {/* Cycling gentle messages */}
            <div
              style={{
                height: "24px",
                position: "relative",
                width: "100%",
                textAlign: "center",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    color: "var(--text-secondary)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    position: "absolute",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {GENTLE_COPY.breakdown.loading[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* User's original input */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--text-secondary)",
                fontStyle: "italic",
                fontWeight: 300,
                opacity: 0.7,
                textAlign: "center",
              }}
            >
              &ldquo;{task}&rdquo;
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskBreakdownModal;
