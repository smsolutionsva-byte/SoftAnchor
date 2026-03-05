"use client";

import { motion } from "motion/react";

interface LoadingOrbProps {
  size?: number;
  inline?: boolean;
  message?: string;
}

const LoadingOrb = ({
  size = 40,
  inline = false,
  message,
}: LoadingOrbProps) => {
  if (inline) {
    return (
      <motion.span
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          type: "tween",
          ease: "easeInOut",
        }}
        style={{
          display: "inline-block",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "var(--accent)",
          marginLeft: 8,
          verticalAlign: "middle",
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          type: "tween",
          ease: "easeInOut",
        }}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, var(--accent), transparent)`,
          filter: "blur(1px)",
          boxShadow: "0 0 40px var(--accent-soft)",
        }}
      />
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--text-secondary)",
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingOrb;
