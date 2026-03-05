"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { getTimeBasedEmpty } from "@/lib/gentleLanguage";

const EmptyTaskState = () => {
  const message = useMemo(() => getTimeBasedEmpty(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "48px 24px",
        maxWidth: "320px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* Simple illustrated figure */}
      <motion.svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Head */}
        <circle
          cx="60"
          cy="32"
          r="16"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Closed eyes */}
        <path
          d="M52 30 Q54 33 56 30"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M64 30 Q66 33 68 30"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Smile */}
        <path
          d="M55 37 Q60 41 65 37"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Body */}
        <path
          d="M60 48 L60 75"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Arms holding book */}
        <path
          d="M60 58 L42 65 L42 85 L78 85 L78 65 L60 58"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Book pages */}
        <line
          x1="60"
          y1="65"
          x2="60"
          y2="85"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="50"
          y1="72"
          x2="56"
          y2="72"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="64"
          y1="72"
          x2="70"
          y2="72"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="50"
          y1="76"
          x2="56"
          y2="76"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="64"
          y1="76"
          x2="70"
          y2="76"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.3"
        />
        {/* Legs */}
        <path
          d="M60 75 L48 100"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M60 75 L72 100"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Sparkle accents */}
        <circle cx="85" cy="25" r="2" fill="var(--accent)" opacity="0.6" />
        <circle cx="35" cy="20" r="1.5" fill="var(--accent)" opacity="0.4" />
        <circle cx="90" cy="50" r="1" fill="var(--accent)" opacity="0.5" />
      </motion.svg>

      <p
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "20px",
          color: "var(--text-primary)",
          fontWeight: 400,
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--text-secondary)",
          fontWeight: 400,
        }}
      >
        type something above to get started 🌸
      </p>
    </motion.div>
  );
};

export default EmptyTaskState;
