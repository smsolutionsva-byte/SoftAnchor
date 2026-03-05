"use client";

import { motion, AnimatePresence } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { formatMinutes, allStepsDone } from "@/lib/taskHelpers";
import { getRandom, GENTLE_COPY } from "@/lib/gentleLanguage";
import SoftButton from "@/components/ui/SoftButton";
import StepItem from "./StepItem";
import useStreaks from "@/hooks/useStreaks";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  index: number;
}

const WEIGHT_COLORS = {
  light: "#86efac",
  medium: "#fcd34d",
  heavy: "#fda4af",
};

const TaskCard = ({ task, index }: TaskCardProps) => {
  const completeTask = useAnchorStore((s) => s.completeTask);
  const skipTask = useAnchorStore((s) => s.skipTask);
  const toggleTaskExpanded = useAnchorStore((s) => s.toggleTaskExpanded);
  const addToast = useAnchorStore((s) => s.addToast);
  const { logWin } = useStreaks();
  const canComplete = allStepsDone(task);

  const handleComplete = () => {
    logWin("task-complete", task.title);
    completeTask(task.id);
  };

  const handleSkip = () => {
    addToast({
      message: getRandom(GENTLE_COPY.taskStatus.skipped),
      type: "info",
      emoji: "🌿",
    });
    skipTask(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 24,
        delay: index * 0.12,
      }}
      style={{ marginBottom: "16px" }}
    >
      <div
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow:
            "0 8px 32px var(--shadow), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: "24px",
          overflow: "hidden",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => toggleTaskExpanded(task.id)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Emotional weight dot */}
            <motion.div
              animate={
                task.emotionalWeight === "heavy"
                  ? { scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }
                  : {}
              }
              transition={
                task.emotionalWeight === "heavy"
                  ? { duration: 2, repeat: Infinity, type: "tween" as const, ease: "easeInOut" as const }
                  : undefined
              }
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: WEIGHT_COLORS[task.emotionalWeight],
                flexShrink: 0,
              }}
            />

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "18px",
                fontWeight: 500,
                color: "var(--text-primary)",
                lineHeight: 1.3,
              }}
            >
              {task.title}
            </h3>
          </div>

          {/* Time pill */}
          <div
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-full)",
              padding: "4px 12px",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 400,
              color: "var(--accent)",
              whiteSpace: "nowrap",
              flexShrink: 0,
              marginLeft: "12px",
            }}
          >
            {formatMinutes(task.estimatedMinutes)}
          </div>
        </div>

        {/* Encouragement */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--text-secondary)",
            marginTop: "4px",
            paddingLeft: "20px",
          }}
        >
          {task.encouragement}
        </p>

        {/* Steps section */}
        <AnimatePresence>
          {task.isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  borderTop: "1px solid var(--glass-border)",
                  marginTop: "16px",
                  paddingTop: "16px",
                }}
              >
                {task.steps.map((step, i) => (
                  <StepItem
                    key={step.id}
                    step={step}
                    taskId={task.id}
                    index={i}
                  />
                ))}
              </div>

              {/* Bottom actions */}
              <div
                style={{
                  borderTop: "1px solid var(--glass-border)",
                  marginTop: "16px",
                  paddingTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={handleSkip}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 300,
                    cursor: "pointer",
                    padding: "4px 8px",
                    opacity: 0.6,
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.opacity = "0.6";
                  }}
                >
                  skip this task
                </button>

                <SoftButton
                  variant="primary"
                  size="sm"
                  onClick={handleComplete}
                  disabled={!canComplete}
                >
                  {canComplete
                    ? "all done ✓"
                    : `${task.steps.filter((s) => s.status === "done").length}/${task.steps.length} steps`}
                </SoftButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TaskCard;
