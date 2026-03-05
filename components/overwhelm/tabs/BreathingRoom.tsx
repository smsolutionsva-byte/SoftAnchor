"use client";

import { useEffect, useRef } from "react";
import useBreathing from "@/hooks/useBreathing";
import useStreaks from "@/hooks/useStreaks";
import BreathingOrb from "@/components/breathing/BreathingOrb";
import BreathingPhaseLabel from "@/components/breathing/BreathingPhaseLabel";
import { BREATHING_PATTERNS, getTotalDuration } from "@/lib/breathingPatterns";
import { motion } from "motion/react";

const BreathingRoom = () => {
  const {
    phase,
    phaseProgress,
    phaseLabel,
    phaseColor,
    currentCycle,
    totalCycles,
    overallProgress,
    isRunning,
    isComplete,
    start,
    stop,
    selectedPattern,
    setPattern,
  } = useBreathing();

  const { logWin } = useStreaks();
  const loggedRef = useRef(false);

  useEffect(() => {
    if (isComplete && !loggedRef.current) {
      loggedRef.current = true;
      logWin("breathing");
    }
    if (!isComplete) {
      loggedRef.current = false;
    }
  }, [isComplete, logWin]);

  const totalSeconds = getTotalDuration(selectedPattern);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const durationLabel =
    minutes > 0
      ? `${minutes}m ${seconds > 0 ? `${seconds}s` : ""}`
      : `${seconds}s`;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Pattern selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {BREATHING_PATTERNS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPattern(p)}
            className="px-3.5 py-2 rounded-2xl text-xs font-body cursor-pointer transition-all duration-200"
            style={{
              background:
                selectedPattern.id === p.id
                  ? "var(--accent)"
                  : "var(--glass-bg)",
              color:
                selectedPattern.id === p.id
                  ? "white"
                  : "var(--text-secondary)",
              border:
                selectedPattern.id === p.id
                  ? "1px solid transparent"
                  : "1px solid var(--glass-border)",
              boxShadow:
                selectedPattern.id === p.id
                  ? "0 4px 14px var(--accent-soft)"
                  : "none",
            }}
          >
            <span className="text-sm">{p.emoji}</span>{" "}
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Pattern description + duration */}
      <div className="text-center">
        <p
          className="text-xs font-body"
          style={{ color: "var(--text-muted)" }}
        >
          {selectedPattern.description}
        </p>
        <p
          className="text-[10px] font-body mt-1"
          style={{ color: "var(--text-muted)", opacity: 0.6 }}
        >
          {selectedPattern.cycles} cycles · ~{durationLabel}
        </p>
      </div>

      {/* Breathing orb area with soft background */}
      <div
        className="relative flex items-center justify-center rounded-3xl w-full"
        style={{
          minHeight: 240,
          background:
            isRunning || isComplete
              ? `radial-gradient(circle at 50% 50%, ${phaseColor}08 0%, transparent 70%)`
              : "transparent",
          transition: "background 1s ease",
        }}
      >
        <BreathingOrb
          phase={phase}
          phaseProgress={phaseProgress}
          phaseColor={phaseColor}
        />

        {/* Overall progress ring (visible during session) */}
        {isRunning && (
          <svg
            className="absolute inset-0 m-auto"
            width={180}
            height={180}
            viewBox="0 0 180 180"
            style={{ opacity: 0.25 }}
          >
            <circle
              cx="90"
              cy="90"
              r="85"
              fill="none"
              stroke="var(--glass-border)"
              strokeWidth="2"
            />
            <motion.circle
              cx="90"
              cy="90"
              r="85"
              fill="none"
              stroke={phaseColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 85}
              strokeDashoffset={2 * Math.PI * 85 * (1 - overallProgress)}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "center",
              }}
            />
          </svg>
        )}
      </div>

      {/* Phase label */}
      <BreathingPhaseLabel
        phase={phase}
        label={phaseLabel}
        currentCycle={currentCycle}
        totalCycles={totalCycles}
      />

      {/* Controls */}
      <div className="flex gap-3">
        {!isRunning && !isComplete && (
          <motion.button
            onClick={start}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-2xl text-sm font-body cursor-pointer border-none"
            style={{
              background: "var(--accent)",
              color: "white",
              boxShadow: "0 4px 20px var(--accent-soft)",
            }}
          >
            begin ✨
          </motion.button>
        )}

        {isRunning && (
          <motion.button
            onClick={stop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-2xl text-sm font-body cursor-pointer"
            style={{
              background: "transparent",
              color: "var(--text-muted)",
              border: "1px solid var(--glass-border)",
            }}
          >
            pause 🤚
          </motion.button>
        )}

        {isComplete && (
          <motion.button
            onClick={start}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-2xl text-sm font-body cursor-pointer"
            style={{
              background: "var(--glass-bg)",
              color: "var(--text-secondary)",
              border: "1px solid var(--glass-border)",
            }}
          >
            once more? 🔄
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default BreathingRoom;
