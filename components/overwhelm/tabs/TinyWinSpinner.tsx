"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getRandomTinyWin } from "@/lib/tinyWins";
import { useAnchorStore } from "@/store/useAnchorStore";
import useStreaks from "@/hooks/useStreaks";
import type { TinyWin } from "@/types";

const SPIN_STAGES = [80, 120, 200, 350, 600]; // ms intervals, decelerating

const TinyWinSpinner = () => {
  const [currentWin, setCurrentWin] = useState<TinyWin | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [displayWin, setDisplayWin] = useState<TinyWin | null>(null);
  const updateSession = useAnchorStore((s) => s.updateSession);
  const { logWin } = useStreaks();
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowCelebration(false);
    timeoutsRef.current = [];

    let elapsed = 0;
    const totalSteps = SPIN_STAGES.length * 3; // Multiple passes
    let step = 0;

    const showNext = () => {
      const win = getRandomTinyWin();
      setDisplayWin(win);
      step++;

      if (step >= totalSteps) {
        // Final win
        const finalWin = getRandomTinyWin();
        setDisplayWin(finalWin);
        setCurrentWin(finalWin);
        setIsSpinning(false);
        return;
      }

      const stageIndex = Math.min(
        Math.floor((step / totalSteps) * SPIN_STAGES.length),
        SPIN_STAGES.length - 1
      );
      const delay = SPIN_STAGES[stageIndex];
      elapsed += delay;

      const t = setTimeout(showNext, delay);
      timeoutsRef.current.push(t);
    };

    showNext();
  }, [isSpinning]);

  const handleDidIt = useCallback(() => {
    updateSession({ tinyWinCompleted: true });
    logWin("tiny-win");
    setShowCelebration(true);

    const t = setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
    timeoutsRef.current.push(t);
  }, [updateSession]);

  return (
    <div className="flex flex-col items-center gap-6">
      <p
        className="text-sm font-body text-center"
        style={{ color: "var(--text-secondary)" }}
      >
        sometimes the tiniest action is the bravest one 🌟
      </p>

      {/* Spinner display */}
      <div
        className="w-full rounded-2xl p-6 flex flex-col items-center justify-center"
        style={{
          minHeight: 120,
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <AnimatePresence mode="wait">
          {displayWin ? (
            <motion.div
              key={displayWin.id + (isSpinning ? "-spin" : "-settled")}
              initial={{ opacity: 0, y: isSpinning ? -20 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: isSpinning ? 20 : 0 }}
              transition={{ duration: isSpinning ? 0.05 : 0.3 }}
              className="text-center"
            >
              <p className="text-2xl mb-2">{displayWin.emoji}</p>
              <p
                className="text-sm font-body"
                style={{ color: "var(--text-primary)" }}
              >
                {displayWin.text}
              </p>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-sm font-body"
              style={{ color: "var(--text-muted)" }}
            >
              tap spin to get your tiny win ✨
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <motion.button
          onClick={spin}
          disabled={isSpinning}
          whileHover={{ scale: isSpinning ? 1 : 1.05 }}
          whileTap={{ scale: isSpinning ? 1 : 0.95 }}
          className="px-6 py-2.5 rounded-xl text-sm font-body cursor-pointer border-none"
          style={{
            background: "var(--accent)",
            color: "white",
            opacity: isSpinning ? 0.6 : 1,
          }}
        >
          {isSpinning ? "spinning..." : currentWin ? "spin again 🎰" : "spin 🎰"}
        </motion.button>

        {currentWin && !isSpinning && !showCelebration && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleDidIt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-xl text-sm font-body cursor-pointer"
            style={{
              background: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid var(--glass-border)",
            }}
          >
            I did it! 🎉
          </motion.button>
        )}
      </div>

      {/* Mini celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center"
          >
            <p className="text-2xl mb-1">🌈</p>
            <p
              className="text-sm font-body"
              style={{ color: "var(--accent)" }}
            >
              look at you go! that took courage 💛
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TinyWinSpinner;
