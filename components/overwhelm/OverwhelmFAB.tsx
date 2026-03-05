"use client";

import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";

const OverwhelmFAB = () => {
  const setSanctuaryOpen = useAnchorStore((s) => s.setSanctuaryOpen);
  const startSession = useAnchorStore((s) => s.startSession);
  const sanctuaryOpen = useAnchorStore((s) => s.sanctuaryOpen);

  const handleClick = () => {
    startSession();
    setSanctuaryOpen(true);
  };

  if (sanctuaryOpen) return null;

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full font-body text-sm cursor-pointer border-none"
      style={{
        background: "var(--glass-bg)",
        color: "var(--text-secondary)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--glass-border)",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        animate={{
          boxShadow: [
            "0 0 0px rgba(255,182,193,0)",
            "0 0 20px rgba(255,182,193,0.3)",
            "0 0 0px rgba(255,182,193,0)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="inline-block rounded-full px-1"
      >
        I&apos;m overwhelmed 🥺
      </motion.span>
    </motion.button>
  );
};

export default OverwhelmFAB;
