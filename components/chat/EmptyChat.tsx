"use client";

import { motion } from "motion/react";
import GlassCard from "@/components/ui/GlassCard";

const floatingIconStyle: React.CSSProperties = {
  width: "96px",
  height: "96px",
  borderRadius: "28px",
  background: "linear-gradient(135deg, #1e293b, #0f172a)",
  border: "1px solid #334155",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "48px",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontStyle: "italic",
  fontSize: "28px",
  color: "var(--text-primary)",
  textAlign: "center",
  fontWeight: 400,
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "16px",
  color: "var(--text-secondary)",
  textAlign: "center",
  lineHeight: 1.7,
  maxWidth: "300px",
};

export default function EmptyChat() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 32px",
        flex: 1,
        gap: "24px",
      }}
    >
      {/* Floating icon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={floatingIconStyle}
        >
          💬
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={titleStyle}
      >
        No messages yet 💬
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={subtitleStyle}
      >
        Be the first to say something 🌸
      </motion.p>

      {/* Helper hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <GlassCard padding="14px 20px">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              maxWidth: "280px",
            }}
          >
            <span style={{ fontSize: "20px", flexShrink: 0 }}>⌨️</span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              Type below and press Enter to start the conversation
            </span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
