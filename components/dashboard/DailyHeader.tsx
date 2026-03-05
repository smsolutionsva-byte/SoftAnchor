"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import UserAvatar from "@/components/auth/UserAvatar";

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "good morning";
  if (hour < 17) return "good afternoon";
  if (hour < 21) return "good evening";
  return "hey there, night owl";
};

const DailyHeader = () => {
  const frequency = useAnchorStore((s) => s.currentFrequency);
  const intention = useAnchorStore((s) => s.intention);

  const greeting = useMemo(() => getGreeting(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "32px",
      }}
    >
      {/* Row 1: greeting + avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "32px",
            fontWeight: 400,
            color: "var(--text-primary)",
            lineHeight: 1.2,
          }}
        >
          {greeting} 💜
        </h1>
        <UserAvatar />
      </div>

      {/* Frequency badge */}
      {frequency && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-full)",
            padding: "6px 16px",
            width: "fit-content",
          }}
        >
          <span style={{ fontSize: "16px" }}>{frequency.emoji}</span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--accent)",
            }}
          >
            {frequency.name}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 300,
              color: "var(--text-secondary)",
            }}
          >
            — {frequency.tagline}
          </span>
        </motion.div>
      )}

      {/* Intention display */}
      {intention && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--text-secondary)",
            paddingLeft: "4px",
          }}
        >
          today&rsquo;s intention: &ldquo;{intention.text}&rdquo;
        </motion.p>
      )}
    </motion.div>
  );
};

export default DailyHeader;
