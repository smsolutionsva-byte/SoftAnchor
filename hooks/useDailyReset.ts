"use client";

import { useState, useEffect } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";

const useDailyReset = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [needsCheckIn, setNeedsCheckIn] = useState(true);

  const checkInCompletedAt = useAnchorStore((s) => s.checkInCompletedAt);
  const resetDaily = useAnchorStore((s) => s.resetDaily);

  useEffect(() => {
    if (!checkInCompletedAt) {
      setNeedsCheckIn(true);
      setIsLoading(false);
      return;
    }

    const completedDate = new Date(checkInCompletedAt).toDateString();
    const today = new Date().toDateString();

    if (completedDate !== today) {
      resetDaily();
      setNeedsCheckIn(true);
    } else {
      setNeedsCheckIn(false);
    }

    setIsLoading(false);
  }, [checkInCompletedAt, resetDaily]);

  return { needsCheckIn, isLoading };
};

export default useDailyReset;
