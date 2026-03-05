"use client";

import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";

const DailySummary = () => {
  const softWins = useAnchorStore((s) => s.softWins);
  const tasks = useAnchorStore((s) => s.tasks);
  const streakData = useAnchorStore((s) => s.streakData);

  const today = new Date().toDateString();
  const todayWins = softWins.filter(
    (w) => new Date(w.timestamp).toDateString() === today
  );
  const completedTasks = tasks.filter((t) => t.status === "done");

  // Only show if 2+ wins
  if (todayWins.length < 2) return null;

  const stats = [
    {
      label: "soft wins",
      value: todayWins.length,
      emoji: "✨",
    },
    completedTasks.length > 0
      ? {
          label: "tasks done",
          value: completedTasks.length,
          emoji: "✅",
        }
      : null,
    streakData.currentStreak > 1
      ? {
          label: "day streak",
          value: streakData.currentStreak,
          emoji: "🔥",
        }
      : null,
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "tween" }}
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {stats.map((s) =>
        s ? (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          >
            <span>{s.emoji}</span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              {s.value}
            </span>
            <span>{s.label}</span>
          </div>
        ) : null
      )}
    </motion.div>
  );
};

export default DailySummary;
