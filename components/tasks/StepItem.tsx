"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { makeStepTinier } from "@/lib/gemini";
import { buildTinySteps } from "@/lib/taskHelpers";
import { getRandom, GENTLE_COPY } from "@/lib/gentleLanguage";
import LoadingOrb from "@/components/ui/LoadingOrb";
import type { MicroStep } from "@/types";

interface StepItemProps {
  step: MicroStep;
  taskId: string;
  index: number;
}

const StepItem = ({ step, taskId, index }: StepItemProps) => {
  const [isMakingTiny, setIsMakingTiny] = useState(false);
  const completeStep = useAnchorStore((s) => s.completeStep);
  const addTinySteps = useAnchorStore((s) => s.addTinySteps);
  const addToast = useAnchorStore((s) => s.addToast);
  const currentFrequency = useAnchorStore((s) => s.currentFrequency);
  const maxVisibleTasks = useAnchorStore((s) => s.maxVisibleTasks);
  const isDone = step.status === "done";

  const handleComplete = useCallback(() => {
    completeStep(taskId, step.id);
    addToast({
      message: getRandom(GENTLE_COPY.taskStatus.stepDone),
      type: "success",
      emoji: "✨",
    });
  }, [taskId, step.id, completeStep, addToast]);

  const handleMakeTinier = useCallback(async () => {
    setIsMakingTiny(true);
    try {
      const tinyTexts = await makeStepTinier(
        step.text,
        currentFrequency?.name ?? "Gentle Drift",
        maxVisibleTasks
      );
      const tinySteps = buildTinySteps(tinyTexts);
      addTinySteps(taskId, step.id, tinySteps);
    } catch {
      addToast({
        message: GENTLE_COPY.breakdown.error,
        type: "soft-error",
        emoji: "💛",
      });
    } finally {
      setIsMakingTiny(false);
    }
  }, [
    step.text,
    step.id,
    taskId,
    currentFrequency,
    maxVisibleTasks,
    addTinySteps,
    addToast,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "8px 0",
        }}
      >
        {/* Soft checkbox */}
        <motion.button
          onClick={isDone ? undefined : handleComplete}
          whileTap={isDone ? undefined : { scale: 0.85 }}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `1.5px solid ${isDone ? "var(--accent)" : "var(--glass-border)"}`,
            background: isDone ? "var(--accent)" : "transparent",
            cursor: isDone ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
            outline: "none",
            transition: "all 0.3s ease",
          }}
        >
          {isDone && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              style={{
                fontSize: "11px",
                color: "var(--bg-primary)",
                lineHeight: 1,
              }}
            >
              ✓
            </motion.span>
          )}
        </motion.button>

        {/* Step text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 400,
              color: "var(--text-primary)",
              textDecoration: isDone ? "line-through" : "none",
              opacity: isDone ? 0.5 : 1,
              transition: "opacity 0.3s ease, text-decoration 0.3s ease",
              lineHeight: 1.5,
            }}
          >
            {step.text}
          </p>

          {/* Tiny version children */}
          {step.tinyVersion && step.tinyVersion.length > 0 && (
            <div style={{ marginTop: "8px", paddingLeft: "8px" }}>
              {step.tinyVersion.map((tiny, ti) => (
                <TinyStepItem
                  key={tiny.id}
                  step={tiny}
                  taskId={taskId}
                  index={ti}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {!isDone && (
            <button
              onClick={handleComplete}
              style={{
                background: "none",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-full)",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 400,
                padding: "4px 12px",
                cursor: "pointer",
                opacity: 0.7,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.opacity = "1";
                (e.target as HTMLButtonElement).style.borderColor =
                  "var(--accent)";
                (e.target as HTMLButtonElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.opacity = "0.7";
                (e.target as HTMLButtonElement).style.borderColor =
                  "var(--glass-border)";
                (e.target as HTMLButtonElement).style.color =
                  "var(--text-secondary)";
              }}
            >
              ✓ done
            </button>
          )}

          {!isDone && !step.isTiny && !step.tinyVersion && (
            <>
              {isMakingTiny ? (
                <LoadingOrb inline size={16} />
              ) : (
                <button
                  onClick={handleMakeTinier}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 300,
                    cursor: "pointer",
                    padding: "4px 8px",
                    opacity: 0.6,
                    transition: "opacity 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.opacity = "0.6";
                  }}
                >
                  make it tinier 🪄
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Sub-component for tiny step children
const TinyStepItem = ({
  step,
  taskId,
  index,
}: {
  step: MicroStep;
  taskId: string;
  index: number;
}) => {
  const completeStep = useAnchorStore((s) => s.completeStep);
  const addToast = useAnchorStore((s) => s.addToast);
  const isDone = step.status === "done";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.08 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "4px 0",
      }}
    >
      <motion.button
        onClick={() => {
          if (!isDone) {
            completeStep(taskId, step.id);
            addToast({
              message: getRandom(GENTLE_COPY.taskStatus.stepDone),
              type: "success",
              emoji: "✨",
            });
          }
        }}
        whileTap={isDone ? undefined : { scale: 0.85 }}
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `1px solid ${isDone ? "var(--accent)" : "var(--glass-border)"}`,
          background: isDone ? "var(--accent)" : "transparent",
          cursor: isDone ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          outline: "none",
          transition: "all 0.3s ease",
        }}
      >
        {isDone && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              fontSize: "8px",
              color: "var(--bg-primary)",
              lineHeight: 1,
            }}
          >
            ✓
          </motion.span>
        )}
      </motion.button>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 300,
          color: "var(--text-secondary)",
          textDecoration: isDone ? "line-through" : "none",
          opacity: isDone ? 0.4 : 0.8,
          transition: "opacity 0.3s ease",
        }}
      >
        {step.text}
      </span>
    </motion.div>
  );
};

export default StepItem;
