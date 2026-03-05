"use client";

import { useState, useCallback } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { breakdownTask } from "@/lib/gemini";
import { buildTaskFromResponse } from "@/lib/taskHelpers";
import { getRandom, GENTLE_COPY } from "@/lib/gentleLanguage";

interface UseTaskBreakdownReturn {
  breakdown: (input: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  currentInput: string;
}

const useTaskBreakdown = (): UseTaskBreakdownReturn => {
  const [error, setError] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState("");

  const currentFrequency = useAnchorStore((s) => s.currentFrequency);
  const maxVisibleTasks = useAnchorStore((s) => s.maxVisibleTasks);
  const intention = useAnchorStore((s) => s.intention);
  const addTask = useAnchorStore((s) => s.addTask);
  const setActiveTaskId = useAnchorStore((s) => s.setActiveTaskId);
  const isBreakdownLoading = useAnchorStore((s) => s.isBreakdownLoading);
  const setBreakdownLoading = useAnchorStore((s) => s.setBreakdownLoading);
  const addToast = useAnchorStore((s) => s.addToast);
  const tasks = useAnchorStore((s) => s.tasks);

  const breakdown = useCallback(
    async (input: string) => {
      setCurrentInput(input);
      setError(null);
      setBreakdownLoading(true);

      try {
        const response = await breakdownTask({
          task: input,
          mood: currentFrequency?.name ?? "Gentle Drift",
          capacity: maxVisibleTasks,
          frequency: currentFrequency?.id ?? "gentle-drift",
          intention: intention?.text ?? "just getting through today",
        });

        const task = buildTaskFromResponse(input, response);
        addTask(task);
        setActiveTaskId(task.id);

        const taskCount = tasks.filter(
          (t) => t.status === "pending" || t.status === "in-progress"
        ).length;
        const encourageMsg =
          taskCount === 0
            ? GENTLE_COPY.encouragement.firstTask
            : taskCount === 1
              ? GENTLE_COPY.encouragement.secondTask
              : GENTLE_COPY.encouragement.thirdTask;

        addToast({
          message: encourageMsg,
          type: "success",
          emoji: "🌸",
        });
      } catch {
        setError(GENTLE_COPY.breakdown.error);
      } finally {
        setBreakdownLoading(false);
      }
    },
    [
      currentFrequency,
      maxVisibleTasks,
      intention,
      addTask,
      setActiveTaskId,
      setBreakdownLoading,
      addToast,
      tasks,
    ]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    breakdown,
    isLoading: isBreakdownLoading,
    error,
    clearError,
    currentInput,
  };
};

export default useTaskBreakdown;
