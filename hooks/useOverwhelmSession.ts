"use client";

import { useCallback } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import type { SanctuaryTab } from "@/types";

const useOverwhelmSession = () => {
  const currentSession = useAnchorStore((s) => s.currentSession);
  const updateSession = useAnchorStore((s) => s.updateSession);
  const setSanctuaryOpen = useAnchorStore((s) => s.setSanctuaryOpen);
  const setActiveSanctuaryTab = useAnchorStore(
    (s) => s.setActiveSanctuaryTab
  );

  const trackTabVisit = useCallback(
    (tab: SanctuaryTab) => {
      setActiveSanctuaryTab(tab);
      if (currentSession && !currentSession.tabsVisited.includes(tab)) {
        updateSession({
          tabsVisited: [...currentSession.tabsVisited, tab],
        });
      }
    },
    [currentSession, updateSession, setActiveSanctuaryTab]
  );

  const closeSession = useCallback(() => {
    setSanctuaryOpen(false);
  }, [setSanctuaryOpen]);

  return { session: currentSession, trackTabVisit, closeSession };
};

export default useOverwhelmSession;
