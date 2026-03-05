"use client";

import { useAnchorStore } from "@/store/useAnchorStore";
import { getTheme } from "@/lib/themes";
import type { Theme } from "@/types";

const useTheme = (): Theme => {
  const activeTheme = useAnchorStore((s) => s.activeTheme);
  return getTheme(activeTheme);
};

export default useTheme;
