"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { TOMORROW_WHISPERS, getTomorrowTask } from "@/lib/eveningLogic";

interface TomorrowWhisperProps {
  onNext: () => void;
}

const TomorrowWhisper = ({ onNext }: TomorrowWhisperProps) => {
  const tasks = useAnchorStore((s) => s.tasks);
  const updateEveningSession = useAnchorStore((s) => s.updateEveningSession);

  const tomorrowTask = useMemo(() => getTomorrowTask(tasks), [tasks]);
  const whisper = useMemo(
    () =>
      TOMORROW_WHISPERS[
        Math.floor(Math.random() * TOMORROW_WHISPERS.length)
      ],
    []
  );

  const handleNext = () => {
    if (tomorrowTask) {
      updateEveningSession({ tomorrowTask });
    }
    onNext();
  };

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
          marginBottom: "8px",
        }}
      >
        {whisper}
      </p>

      {tomorrowTask ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, type: "tween" }}
          style={{
            padding: "16px 24px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            marginTop: "16px",
            marginBottom: "20px",
            maxWidth: "360px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "rgba(255,255,255,0.8)",
              margin: "0 0 6px 0",
            }}
          >
            🌱 {tomorrowTask}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            just this one thing. that&apos;s enough.
          </p>
        </motion.div>
      ) : (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            fontStyle: "italic",
            marginTop: "12px",
            marginBottom: "20px",
          }}
        >
          No pending tasks — tomorrow is a fresh page. 📝
        </p>
      )}

      <motion.button
        onClick={handleNext}
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
        }}
      >
        one last thing →
      </motion.button>
    </div>
  );
};

export default TomorrowWhisper;
