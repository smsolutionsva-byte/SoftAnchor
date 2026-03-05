"use client";

import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";

interface GlowMapStepProps {
  onNext: () => void;
}

const GlowMapStep = ({ onNext }: GlowMapStepProps) => {
  const tasks = useAnchorStore((s) => s.tasks);
  const softWins = useAnchorStore((s) => s.softWins);

  const completedTasks = tasks.filter((t) => t.status === "done");
  const todayWins = softWins.filter((w) => {
    const today = new Date().toDateString();
    return new Date(w.timestamp).toDateString() === today;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "18px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.85)",
          marginBottom: "20px",
        }}
      >
        look what you did today ✨
      </p>

      {/* Completed tasks with glow */}
      {completedTasks.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "16px",
            width: "100%",
            maxWidth: "360px",
          }}
        >
          {completedTasks.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.15,
                type: "tween",
              }}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "rgba(255,255,255,0.8)",
                textAlign: "left",
                boxShadow: "0 0 12px rgba(250, 204, 21, 0.08)",
              }}
            >
              ✅ {t.title}
            </motion.div>
          ))}
        </div>
      )}

      {/* Soft win pills */}
      {todayWins.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            justifyContent: "center",
            marginBottom: "16px",
            maxWidth: "360px",
          }}
        >
          {todayWins
            .filter((w) => w.type !== "app-open")
            .slice(0, 8)
            .map((w, i) => (
              <motion.span
                key={`${w.type}-${w.timestamp}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: completedTasks.length * 0.15 + i * 0.1,
                  type: "tween",
                }}
                style={{
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontFamily: "var(--font-body)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {w.note || w.type}
              </motion.span>
            ))}
        </div>
      )}

      {/* Empty state */}
      {completedTasks.length === 0 && todayWins.length <= 1 && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            fontStyle: "italic",
            marginBottom: "16px",
          }}
        >
          Sometimes the bravest thing is just showing up. You did that. 💛
        </p>
      )}

      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          padding: "10px 24px",
          borderRadius: "12px",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 500,
          border: "none",
          background: "var(--orb-1)",
          color: "white",
          cursor: "pointer",
          marginTop: "8px",
        }}
      >
        next →
      </motion.button>
    </div>
  );
};

export default GlowMapStep;
