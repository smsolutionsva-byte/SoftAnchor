"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import type { GentleToast } from "@/types";

interface UseGentleToastReturn {
  toasts: GentleToast[];
  toast: (
    message: string,
    type?: GentleToast["type"],
    emoji?: string
  ) => void;
}

const useGentleToast = (): UseGentleToastReturn => {
  const toasts = useAnchorStore((s) => s.toasts);
  const addToast = useAnchorStore((s) => s.addToast);
  const removeToast = useAnchorStore((s) => s.removeToast);
  const timerRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    toasts.forEach((t) => {
      if (!timerRefs.current.has(t.id)) {
        const timer = setTimeout(() => {
          removeToast(t.id);
          timerRefs.current.delete(t.id);
        }, 3000);
        timerRefs.current.set(t.id, timer);
      }
    });

    return () => {
      timerRefs.current.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  const toast = useCallback(
    (
      message: string,
      type: GentleToast["type"] = "info",
      emoji: string = "✨"
    ) => {
      addToast({ message, type, emoji });
    },
    [addToast]
  );

  return { toasts, toast };
};

export default useGentleToast;
