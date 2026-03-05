"use client";

import { useEffect, useMemo } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { getSpace } from "@/lib/softSpaces";
import BackgroundCanvas from "./BackgroundCanvas";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const activeTheme = useAnchorStore((s) => s.activeTheme);
  const activeSoftSpace = useAnchorStore((s) => s.activeSoftSpace);
  const space = getSpace(activeSoftSpace);

  // Sync data-theme to <html> so body { var(--bg-primary) } works
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  // Build inline CSS custom properties from the space’s themeOverride.
  // Inline styles on this div beat the [data-theme] CSS rule for the
  // same variables, so switching spaces actually changes the orb / accent
  // colours visible to every child.
  const wrapperStyle = useMemo(() => {
    const vars: Record<string, string> = {};
    Object.entries(space.themeOverride).forEach(([k, v]) => {
      vars[k] = v as string;
    });
    return {
      minHeight: "100vh",
      position: "relative" as const,
      transition:
        "background 0.8s ease, color 0.8s ease",
      background: space.backgroundGradient,
      ...vars,
    };
  }, [space]);

  return (
    <div
      data-theme={activeTheme}
      data-space={activeSoftSpace}
      style={wrapperStyle as React.CSSProperties}
    >
      <BackgroundCanvas />
      <main style={{ position: "relative", zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default AppShell;
