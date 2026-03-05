"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { checkForSpiral } from "@/lib/spiralDetection";

const useSpiralDetector = () => {
  const overwhelmCount = useAnchorStore((s) => s.overwhelmCount);
  const lastOverwhelmAt = useAnchorStore((s) => s.lastOverwhelmAt);
  const spiralDetected = useAnchorStore((s) => s.spiralDetected);
  const setSpiralDetected = useAnchorStore((s) => s.setSpiralDetected);
  const tasks = useAnchorStore((s) => s.tasks);

  const taskActionsRef = useRef<{ type: string; timestamp: string }[]>([]);
  const prevTaskCountRef = useRef(tasks.length);

  // Track task additions/removals
  useEffect(() => {
    const currentCount = tasks.length;
    const prevCount = prevTaskCountRef.current;

    if (currentCount !== prevCount) {
      const actionType = currentCount > prevCount ? "add" : "delete";
      taskActionsRef.current.push({
        type: actionType,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 20 actions to avoid memory leak
      if (taskActionsRef.current.length > 20) {
        taskActionsRef.current = taskActionsRef.current.slice(-20);
      }
    }

    prevTaskCountRef.current = currentCount;
  }, [tasks.length]);

  // Check for spiral patterns
  useEffect(() => {
    if (spiralDetected) return; // Already detected, don't re-check

    const isSpiral = checkForSpiral({
      overwhelmCount,
      lastOverwhelmAt,
      recentTaskActions: taskActionsRef.current,
    });

    if (isSpiral) {
      setSpiralDetected(true);
    }
  }, [overwhelmCount, lastOverwhelmAt, spiralDetected, setSpiralDetected]);

  const dismissSpiral = useCallback(() => {
    setSpiralDetected(false);
  }, [setSpiralDetected]);

  return { spiralDetected, dismissSpiral };
};

export default useSpiralDetector;
