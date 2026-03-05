"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, useAnimate } from "motion/react";
import SoftButton from "@/components/ui/SoftButton";
import LoadingOrb from "@/components/ui/LoadingOrb";
import useTaskBreakdown from "@/hooks/useTaskBreakdown";
import { useAnchorStore } from "@/store/useAnchorStore";
import {
  getRandom,
  getMaxTasksMessage,
  GENTLE_COPY,
} from "@/lib/gentleLanguage";

const TaskInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { breakdown, isLoading } = useTaskBreakdown();
  const tasks = useAnchorStore((s) => s.tasks);
  const maxVisibleTasks = useAnchorStore((s) => s.maxVisibleTasks);
  const [scope, animate] = useAnimate();
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholder = useMemo(
    () => getRandom(GENTLE_COPY.taskInput.placeholder),
    []
  );

  const activeTasks = tasks.filter(
    (t) => t.status === "pending" || t.status === "in-progress"
  );
  const atMax = activeTasks.length >= maxVisibleTasks;

  const handleSubmit = useCallback(async () => {
    if (inputValue.trim().length < 3) {
      animate(scope.current, { x: [0, -8, 8, -8, 8, 0] }, { duration: 0.4 });
      return;
    }
    if (isLoading || atMax) return;
    const val = inputValue;
    setInputValue("");
    await breakdown(val);
  }, [inputValue, isLoading, atMax, breakdown, animate, scope]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const buttonLabel = isLoading
    ? GENTLE_COPY.taskInput.buttonLoading
    : inputValue.trim().length > 0 && inputValue.trim().length < 3
      ? GENTLE_COPY.taskInput.buttonTooShort
      : GENTLE_COPY.taskInput.buttonIdle;

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: `1px solid ${isFocused ? "var(--accent)" : "var(--glass-border)"}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: isFocused
          ? "0 0 0 2px var(--accent-soft), 0 8px 32px var(--shadow)"
          : "0 8px 32px var(--shadow)",
        padding: "24px",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <label
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "20px",
          color: "var(--text-primary)",
          fontWeight: 400,
          display: "block",
          marginBottom: "16px",
        }}
      >
        what do you want to anchor today?
      </label>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          fontFamily: "var(--font-body)",
          fontSize: "18px",
          color: "var(--text-primary)",
          fontWeight: 400,
          padding: "12px 0",
          marginBottom: "16px",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <SoftButton
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={
            isLoading ||
            atMax ||
            inputValue.trim().length < 3
          }
        >
          {buttonLabel}
          {isLoading && <LoadingOrb inline size={16} />}
        </SoftButton>

        {atMax && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-secondary)",
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            {getMaxTasksMessage(maxVisibleTasks)}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default TaskInput;
