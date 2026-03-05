"use client";

import { useState, useEffect, useCallback } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { isEveningTime } from "@/lib/eveningLogic";

interface UseEveningUnwindReturn {
  shouldPromptEvening: boolean;
  isEveningOpen: boolean;
  openEvening: () => void;
  closeEvening: () => void;
  dismissPrompt: () => void;
}

const useEveningUnwind = (): UseEveningUnwindReturn => {
  const eveningSessionToday = useAnchorStore((s) => s.eveningSessionToday);
  const eveningPromptDismissed = useAnchorStore(
    (s) => s.eveningPromptDismissed
  );
  const setEveningPromptDismissed = useAnchorStore(
    (s) => s.setEveningPromptDismissed
  );
  const setEveningSession = useAnchorStore((s) => s.setEveningSession);
  const checkInCompletedAt = useAnchorStore((s) => s.checkInCompletedAt);
  const tasks = useAnchorStore((s) => s.tasks);

  const [shouldPromptEvening, setShouldPromptEvening] = useState(false);
  const [isEveningOpen, setIsEveningOpen] = useState(false);

  // Check every 5 minutes
  useEffect(() => {
    const check = () => {
      const should =
        isEveningTime() &&
        eveningSessionToday === null &&
        !eveningPromptDismissed &&
        checkInCompletedAt !== null &&
        tasks.length > 0;
      setShouldPromptEvening(should);
    };

    check();
    const interval = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [eveningSessionToday, eveningPromptDismissed, checkInCompletedAt, tasks]);

  const openEvening = useCallback(() => {
    setIsEveningOpen(true);
    setEveningSession({
      startedAt: new Date().toISOString(),
      reflectionText: "",
      tomorrowTask: null,
      completedAt: null,
      skipped: false,
    });
    setShouldPromptEvening(false);
  }, [setEveningSession]);

  const closeEvening = useCallback(() => {
    setIsEveningOpen(false);
  }, []);

  const dismissPrompt = useCallback(() => {
    setEveningPromptDismissed(true);
    setShouldPromptEvening(false);
  }, [setEveningPromptDismissed]);

  return {
    shouldPromptEvening,
    isEveningOpen,
    openEvening,
    closeEvening,
    dismissPrompt,
  };
};

export default useEveningUnwind;
