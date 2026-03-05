"use client";

import { useState, useCallback } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { getSpace } from "@/lib/softSpaces";
import type { SoftSpace, SoftSpaceId } from "@/types";

interface UseSoftSpaceReturn {
  space: SoftSpace;
  setSpace: (id: SoftSpaceId) => void;
  isTransitioning: boolean;
}

const useSoftSpace = (): UseSoftSpaceReturn => {
  const activeSoftSpace = useAnchorStore((s) => s.activeSoftSpace);
  const setActiveSoftSpace = useAnchorStore((s) => s.setActiveSoftSpace);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const space = getSpace(activeSoftSpace);

  // Space CSS vars are now applied as inline styles on the AppShell div,
  // so we no longer need to touch document.documentElement here.

  const setSpace = useCallback(
    (id: SoftSpaceId) => {
      if (id === activeSoftSpace) return;
      setIsTransitioning(true);
      setActiveSoftSpace(id);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [activeSoftSpace, setActiveSoftSpace]
  );

  return { space, setSpace, isTransitioning };
};

export default useSoftSpace;
