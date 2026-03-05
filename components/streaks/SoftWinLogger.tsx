"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import useStreaks from "@/hooks/useStreaks";
import type { SoftWin } from "@/types";

const WIN_TYPES: { type: SoftWin["type"]; emoji: string; label: string }[] = [
  { type: "tiny-win", emoji: "✨", label: "Tiny win" },
  { type: "brain-dump", emoji: "💝", label: "Kind thought" },
  { type: "breathing", emoji: "🌬️", label: "Breathing done" },
  { type: "task-complete", emoji: "✅", label: "Task done" },
];

const SoftWinLogger = () => {
  const { logWin } = useStreaks();
  const [customMode, setCustomMode] = useState(false);
  const [note, setNote] = useState("");
  const [justLogged, setJustLogged] = useState<string | null>(null);

  const handleLog = (type: SoftWin["type"], label?: string) => {
    logWin(type, label);
    setJustLogged(type);
    setTimeout(() => setJustLogged(null), 1500);
  };

  const handleCustomSubmit = () => {
    if (note.trim()) {
      handleLog("tiny-win", note.trim());
      setNote("");
      setCustomMode(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {WIN_TYPES.map((w) => (
        <motion.button
          key={w.type}
          onClick={() => handleLog(w.type)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "4px 12px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontFamily: "var(--font-body)",
            border: "1px solid var(--glass-border)",
            background: justLogged === w.type ? "var(--orb-1)" : "var(--glass-bg)",
            color: justLogged === w.type ? "white" : "var(--text-secondary)",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          {w.emoji} {w.label}
        </motion.button>
      ))}

      {/* Custom note toggle */}
      <AnimatePresence>
        {customMode ? (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            style={{ display: "flex", gap: "4px", overflow: "hidden" }}
          >
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
              placeholder="Your soft win..."
              autoFocus
              style={{
                padding: "4px 10px",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "var(--font-body)",
                border: "1px solid var(--glass-border)",
                background: "var(--glass-bg)",
                color: "var(--text-primary)",
                outline: "none",
                width: "140px",
              }}
            />
            <motion.button
              onClick={handleCustomSubmit}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "4px 8px",
                borderRadius: "8px",
                fontSize: "12px",
                border: "none",
                background: "var(--orb-1)",
                color: "white",
                cursor: "pointer",
              }}
            >
              +
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            onClick={() => setCustomMode(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontFamily: "var(--font-body)",
              border: "1px dashed var(--glass-border)",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            + note
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoftWinLogger;
