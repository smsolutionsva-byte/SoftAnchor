"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { countCompletedSteps } from "@/lib/taskHelpers";
import { getRandom, GENTLE_COPY } from "@/lib/gentleLanguage";

const ProgressWhisper = () => {
  const tasks = useAnchorStore((s) => s.tasks);

  const stats = useMemo(() => {
    const activeTasks = tasks.filter(
      (t) => t.status === "pending" || t.status === "in-progress"
    );
    const doneTasks = tasks.filter((t) => t.status === "done");
    const totalSteps = activeTasks.reduce(
      (acc, t) => acc + t.steps.length,
      0
    );
    const completedSteps = activeTasks.reduce(
      (acc, t) => acc + countCompletedSteps(t),
      0
    );

    return {
      active: activeTasks.length,
      done: doneTasks.length,
      totalSteps,
      completedSteps,
    };
  }, [tasks]);

  // Only show if there are active tasks
  if (stats.active === 0 && stats.done === 0) return null;

  const getMessage = (): string => {
    if (stats.done > 0 && stats.active === 0) {
      return "you've completed everything for today. rest well 🌿";
    }
    if (stats.completedSteps === 0) {
      return "you've got this — one tiny step at a time 💜";
    }
    if (stats.completedSteps > 0 && stats.completedSteps < stats.totalSteps) {
      return `${stats.completedSteps} step${stats.completedSteps > 1 ? "s" : ""} anchored — ${getRandom(Object.values(GENTLE_COPY.encouragement))}`;
    }
    if (stats.completedSteps >= stats.totalSteps && stats.active > 0) {
      return "all steps done — ready to mark complete? ✨";
    }
    return getRandom(Object.values(GENTLE_COPY.encouragement));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{
        textAlign: "center",
        padding: "12px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 300,
          fontStyle: "italic",
          color: "var(--text-secondary)",
          opacity: 0.8,
        }}
      >
        {getMessage()}
      </p>
    </motion.div>
  );
};

export default ProgressWhisper;
