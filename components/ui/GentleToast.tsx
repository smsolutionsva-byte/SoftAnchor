"use client";

import { motion, AnimatePresence } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";

const GentleToastContainer = () => {
  const toasts = useAnchorStore((s) => s.toasts);

  const getBorderColor = (type: "success" | "info" | "soft-error") => {
    switch (type) {
      case "success":
        return "var(--accent)";
      case "soft-error":
        return "rgba(251, 113, 133, 0.5)";
      case "info":
      default:
        return "var(--glass-border)";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 90,
        display: "flex",
        flexDirection: "column-reverse",
        gap: "8px",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
            style={{
              maxWidth: 320,
              padding: "12px 20px",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid var(--glass-border)",
              borderLeft: `3px solid ${getBorderColor(toast.type)}`,
              borderRadius: "var(--radius-md)",
              boxShadow: "0 8px 32px var(--shadow)",
              pointerEvents: "auto",
            }}
          >
            <span style={{ fontSize: "20px", lineHeight: 1, flexShrink: 0 }}>
              {toast.emoji}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 400,
                color: "var(--text-primary)",
              }}
            >
              {toast.message}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GentleToastContainer;
