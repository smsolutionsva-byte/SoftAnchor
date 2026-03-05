"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { BreathingPhase } from "@/types";

interface BreathingOrbProps {
  phase: BreathingPhase;
  phaseProgress: number;
  phaseColor: string;
}

const springConfig = { stiffness: 60, damping: 15 };

const getTargetScale = (phase: BreathingPhase, progress: number): number => {
  switch (phase) {
    case "inhale":
      return 0.6 + 0.4 * progress; // 0.6 → 1.0
    case "hold-in":
      return 1.0;
    case "exhale":
      return 1.0 - 0.4 * progress; // 1.0 → 0.6
    case "hold-out":
      return 0.6;
    case "complete":
      return 0.8;
    case "idle":
    default:
      return 0.7;
  }
};

const BreathingOrb = ({ phase, phaseProgress, phaseColor }: BreathingOrbProps) => {
  const scaleRaw = useMotionValue(0.7);
  const scale = useSpring(scaleRaw, springConfig);

  useEffect(() => {
    const target = getTargetScale(phase, phaseProgress);
    scaleRaw.set(target);
  }, [phase, phaseProgress, scaleRaw]);

  const isActive = phase !== "idle";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          scale,
          background: `radial-gradient(circle, ${phaseColor}22 0%, transparent 70%)`,
          filter: isActive ? "blur(20px)" : "blur(10px)",
        }}
        animate={{
          opacity: isActive ? [0.4, 0.7, 0.4] : 0.2,
        }}
        transition={{
          opacity: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 130,
          height: 130,
          scale,
          background: `radial-gradient(circle, ${phaseColor}33 0%, ${phaseColor}11 60%, transparent 100%)`,
          filter: "blur(8px)",
        }}
      />

      {/* Core orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 90,
          height: 90,
          scale,
          background: `radial-gradient(circle at 40% 40%, ${phaseColor}88, ${phaseColor}44 60%, ${phaseColor}22 100%)`,
          boxShadow: isActive
            ? `0 0 40px ${phaseColor}44, 0 0 80px ${phaseColor}22`
            : `0 0 20px ${phaseColor}22`,
        }}
        animate={
          phase === "idle"
            ? {
                scale: [0.68, 0.72, 0.68],
              }
            : undefined
        }
        transition={
          phase === "idle"
            ? {
                duration: 4,
                repeat: Infinity,
                type: "tween" as const,
                ease: "easeInOut" as const,
              }
            : undefined
        }
      />

      {/* Center dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 16,
          height: 16,
          backgroundColor: phaseColor,
          opacity: 0.6,
        }}
        animate={{
          opacity: isActive ? [0.4, 0.8, 0.4] : 0.3,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default BreathingOrb;
