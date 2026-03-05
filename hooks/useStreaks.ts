"use client";

import { useState, useEffect, useCallback } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { calculateStreak } from "@/lib/streakLogic";
import { checkBadgeUnlock } from "@/lib/badges";
import type { Badge, SoftWin, StreakData } from "@/types";

interface UseStreaksReturn {
  streakData: StreakData;
  logWin: (type: SoftWin["type"], note?: string) => void;
  badges: Badge[];
  newBadge: Badge | null;
  dismissNewBadge: () => void;
}

const useStreaks = (): UseStreaksReturn => {
  const softWins = useAnchorStore((s) => s.softWins);
  const addSoftWin = useAnchorStore((s) => s.addSoftWin);
  const unlockedBadges = useAnchorStore((s) => s.unlockedBadges);
  const unlockBadge = useAnchorStore((s) => s.unlockBadge);

  const [streakData, setStreakData] = useState<StreakData>(() =>
    calculateStreak(softWins)
  );
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  // Recalculate on wins change
  useEffect(() => {
    const data = calculateStreak(softWins);
    setStreakData(data);

    // Check for badge unlock
    const badge = checkBadgeUnlock(
      data.totalWins,
      data.currentStreak,
      unlockedBadges
    );
    if (badge) {
      const timestamped = {
        ...badge,
        unlockedAt: new Date().toISOString(),
      };
      unlockBadge(timestamped);
      setNewBadge(timestamped);
    }
  }, [softWins, unlockedBadges, unlockBadge]);

  const logWin = useCallback(
    (type: SoftWin["type"], note?: string) => {
      // Prevent duplicate app-open logs per day
      if (type === "app-open") {
        const today = new Date().toDateString();
        const alreadyLogged = softWins.some(
          (w) =>
            w.type === "app-open" &&
            new Date(w.timestamp).toDateString() === today
        );
        if (alreadyLogged) return;
      }
      addSoftWin(type, note);
    },
    [addSoftWin, softWins]
  );

  const dismissNewBadge = useCallback(() => {
    setNewBadge(null);
  }, []);

  return {
    streakData,
    logWin,
    badges: unlockedBadges,
    newBadge,
    dismissNewBadge,
  };
};

export default useStreaks;
