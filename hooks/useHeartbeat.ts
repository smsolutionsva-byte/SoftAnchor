"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { getSpace } from "@/lib/softSpaces";

import type { MotionValue } from "motion";

interface UseHeartbeatReturn {
  smoothX: ReturnType<typeof useSpring>;
  smoothY: ReturnType<typeof useSpring>;
  breathScale: MotionValue<number>;
  cursorColor: string;
}

const useHeartbeat = (): UseHeartbeatReturn => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const breathScale = useMotionValue(1);

  const smoothX = useSpring(x, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 15 });

  const activeSoftSpace = useAnchorStore((s) => s.activeSoftSpace);
  const space = getSpace(activeSoftSpace);
  const cursorColor = space.cursorColor;

  // Track mouse position
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  // Breathing rhythm: 12 breaths/min → 5s per cycle
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const cycleDuration = 5000; // 5 seconds
    const startTime = Date.now();

    const tick = () => {
      const elapsed = (Date.now() - startTime) % cycleDuration;
      const progress = elapsed / cycleDuration;

      // 0-0.5: inhale (1 → 1.4), 0.5-1: exhale (1.4 → 1)
      let scale: number;
      if (progress < 0.5) {
        scale = 1 + 0.4 * (progress / 0.5);
      } else {
        scale = 1.4 - 0.4 * ((progress - 0.5) / 0.5);
      }
      breathScale.set(scale);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [breathScale]);

  return { smoothX, smoothY, breathScale, cursorColor };
};

export default useHeartbeat;
