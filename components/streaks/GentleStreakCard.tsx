"use client";

import { motion } from "motion/react";
import useStreaks from "@/hooks/useStreaks";
import { getStreakMessage, getWinsMessage } from "@/lib/streakLogic";

const GentleStreakCard = () => {
  const { streakData, badges } = useStreaks();
  const totalWins = streakData.totalWins;

  if (totalWins === 0) return null;

  const streakMsg = getStreakMessage(streakData);
  const winsMsg = getWinsMessage(totalWins);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "tween" }}
      style={{
        background: "var(--glass-bg)",
        borderRadius: "16px",
        border: "1px solid var(--glass-border)",
        padding: "20px 24px",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Streak number */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "48px",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1,
          }}
        >
          {streakData.currentStreak}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          {streakData.currentStreak === 1 ? "day" : "days"} gentle streak
          {streakData.isSleeping && " 💤"}
        </span>
      </div>

      {/* Messages */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "var(--text-muted)",
          margin: "0 0 4px 0",
          fontStyle: "italic",
        }}
      >
        {streakMsg}
      </p>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "var(--text-secondary)",
          margin: 0,
        }}
      >
        {winsMsg} — {totalWins} soft {totalWins === 1 ? "win" : "wins"} total
      </p>

      {/* Badge pills */}
      {badges.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: "12px",
          }}
        >
          {badges.map((b) => (
            <span
              key={b.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 10px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontFamily: "var(--font-body)",
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-secondary)",
              }}
              title={b.description}
            >
              {b.emoji} {b.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default GentleStreakCard;
