"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { DEFAULT_PATTERN } from "@/lib/breathingPatterns";
import type { BreathingPattern, BreathingPhase } from "@/types";

interface UseBreathingReturn {
  phase: BreathingPhase;
  currentCycle: number;
  totalCycles: number;
  phaseProgress: number;
  overallProgress: number;
  phaseLabel: string;
  phaseColor: string;
  start: () => void;
  stop: () => void;
  isRunning: boolean;
  isComplete: boolean;
  selectedPattern: BreathingPattern;
  setPattern: (p: BreathingPattern) => void;
}

const PHASE_LABELS: Record<BreathingPhase, string> = {
  idle: "ready when you are 🌸",
  inhale: "breathe in...",
  "hold-in": "hold gently...",
  exhale: "breathe out...",
  "hold-out": "rest here...",
  complete: "beautifully done 💛",
};

const PHASE_COLORS: Record<BreathingPhase, string> = {
  idle: "var(--glass-border)",
  inhale: "var(--accent)",
  "hold-in": "var(--accent)",
  exhale: "#a5b4fc",
  "hold-out": "#c4b5fd",
  complete: "#86efac",
};

const useBreathing = (): UseBreathingReturn => {
  const [selectedPattern, setSelectedPattern] =
    useState<BreathingPattern>(DEFAULT_PATTERN);
  const [phase, setPhase] = useState<BreathingPhase>("idle");
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const incrementBreathingSessions = useAnchorStore(
    (s) => s.incrementBreathingSessions
  );
  const updateSession = useAnchorStore((s) => s.updateSession);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseStartRef = useRef(0);
  const phaseDurationRef = useRef(0);
  const cycleRef = useRef(0);
  const phaseQueueRef = useRef<BreathingPhase[]>([]);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const buildPhaseQueue = useCallback(
    (pattern: BreathingPattern): BreathingPhase[] => {
      const queue: BreathingPhase[] = [];
      for (let c = 0; c < pattern.cycles; c++) {
        queue.push("inhale");
        if (pattern.holdIn > 0) queue.push("hold-in");
        queue.push("exhale");
        if (pattern.holdOut > 0) queue.push("hold-out");
      }
      return queue;
    },
    []
  );

  const getPhaseDuration = useCallback(
    (p: BreathingPhase, pattern: BreathingPattern): number => {
      switch (p) {
        case "inhale":
          return pattern.inhale;
        case "hold-in":
          return pattern.holdIn;
        case "exhale":
          return pattern.exhale;
        case "hold-out":
          return pattern.holdOut;
        default:
          return 0;
      }
    },
    []
  );

  const advancePhase = useCallback(() => {
    const queue = phaseQueueRef.current;
    if (queue.length === 0) {
      // Complete
      setPhase("complete");
      setIsRunning(false);
      setIsComplete(true);
      setPhaseProgress(1);
      cleanup();
      incrementBreathingSessions();
      updateSession({ breathingCompleted: true });
      return;
    }

    const next = queue.shift()!;
    const dur = getPhaseDuration(next, selectedPattern);

    // Track which cycle we're on
    if (next === "inhale") {
      cycleRef.current += 1;
      setCurrentCycle(cycleRef.current);
    }

    setPhase(next);
    setPhaseProgress(0);
    phaseStartRef.current = Date.now();
    phaseDurationRef.current = dur * 1000;
  }, [
    selectedPattern,
    getPhaseDuration,
    cleanup,
    incrementBreathingSessions,
    updateSession,
  ]);

  const start = useCallback(() => {
    cleanup();
    const queue = buildPhaseQueue(selectedPattern);
    phaseQueueRef.current = queue;
    cycleRef.current = 0;
    setCurrentCycle(0);
    setIsRunning(true);
    setIsComplete(false);
    setPhaseProgress(0);

    // Start first phase
    const first = queue.shift()!;
    const dur = getPhaseDuration(first, selectedPattern);
    cycleRef.current = 1;
    setCurrentCycle(1);
    setPhase(first);
    phaseStartRef.current = Date.now();
    phaseDurationRef.current = dur * 1000;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - phaseStartRef.current;
      const progress = Math.min(elapsed / phaseDurationRef.current, 1);
      setPhaseProgress(progress);

      if (progress >= 1) {
        // Move to next phase — use the ref directly
        const q = phaseQueueRef.current;
        if (q.length === 0) {
          setPhase("complete");
          setIsRunning(false);
          setIsComplete(true);
          setPhaseProgress(1);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          incrementBreathingSessions();
          updateSession({ breathingCompleted: true });
          return;
        }

        const nextPhase = q.shift()!;
        const nextDur = getPhaseDuration(nextPhase, selectedPattern);

        if (nextPhase === "inhale") {
          cycleRef.current += 1;
          setCurrentCycle(cycleRef.current);
        }

        setPhase(nextPhase);
        setPhaseProgress(0);
        phaseStartRef.current = Date.now();
        phaseDurationRef.current = nextDur * 1000;
      }
    }, 50);
  }, [
    selectedPattern,
    buildPhaseQueue,
    getPhaseDuration,
    cleanup,
    incrementBreathingSessions,
    updateSession,
  ]);

  const stop = useCallback(() => {
    cleanup();
    setPhase("idle");
    setIsRunning(false);
    setIsComplete(false);
    setPhaseProgress(0);
    setCurrentCycle(0);
    cycleRef.current = 0;
    phaseQueueRef.current = [];
  }, [cleanup]);

  const setPattern = useCallback(
    (p: BreathingPattern) => {
      if (isRunning) stop();
      setSelectedPattern(p);
    },
    [isRunning, stop]
  );

  // Compute overall progress
  const totalPhases = buildPhaseQueue(selectedPattern).length;
  const completedPhases =
    totalPhases - phaseQueueRef.current.length - (isRunning ? 1 : 0);
  const overallProgress = isComplete
    ? 1
    : phase === "idle"
      ? 0
      : Math.max(
          0,
          (completedPhases + phaseProgress) / Math.max(totalPhases, 1)
        );

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    phase,
    currentCycle,
    totalCycles: selectedPattern.cycles,
    phaseProgress,
    overallProgress,
    phaseLabel: PHASE_LABELS[phase],
    phaseColor: PHASE_COLORS[phase],
    start,
    stop,
    isRunning,
    isComplete,
    selectedPattern,
    setPattern,
  };
};

export default useBreathing;
