"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { SoftSpace } from "@/types";

interface SpaceBackgroundProps {
  space: SoftSpace;
}

// ─── Petal overlay for Sakura ───
const PetalOverlay = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 8 + Math.random() * 12,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 8,
        drift: (Math.random() - 0.5) * 200,
        opacity: 0.3 + Math.random() * 0.3,
      })),
    []
  );

  return (
    <>
      {petals.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-5%",
            width: p.size,
            height: p.size * 0.6,
            borderRadius: "50%",
            background: `rgba(249, 168, 212, ${p.opacity})`,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            type: "tween",
            ease: "linear",
          }}
        />
      ))}
    </>
  );
};

// ─── Flicker overlay for Candlelit ───
const FlickerOverlay = () => {
  const embers = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        x: 30 + Math.random() * 40,
        size: 3 + Math.random() * 3,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 4,
      })),
    []
  );

  return (
    <>
      {/* Candlelight luminance flicker */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(252,211,77,0.06), transparent 70%)",
        }}
        animate={{
          opacity: [0.03, 0.07, 0.04, 0.08, 0.03],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          type: "tween",
          ease: "linear",
        }}
      />

      {/* Embers */}
      {embers.map((e) => (
        <motion.div
          key={e.id}
          style={{
            position: "absolute",
            left: `${e.x}%`,
            bottom: "20%",
            width: e.size,
            height: e.size,
            borderRadius: "50%",
            background: "#f59e0b",
          }}
          animate={{
            y: [0, -200],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            type: "tween",
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
};

// ─── Waves overlay for Ocean ───
const WavesOverlay = () => (
  <>
    {[0, 1].map((i) => (
      <motion.div
        key={i}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "200%",
          height: i === 0 ? 60 : 40,
          opacity: i === 0 ? 0.12 : 0.08,
        }}
        animate={{ x: [0, -800] }}
        transition={{
          duration: i === 0 ? 8 : 12,
          repeat: Infinity,
          type: "tween",
          ease: "linear",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1600 60"
          preserveAspectRatio="none"
        >
          <path
            d={`M0,${30 + i * 5} Q200,${10 - i * 5} 400,${30 + i * 5} T800,${30 + i * 5} T1200,${30 + i * 5} T1600,${30 + i * 5} V60 H0 Z`}
            fill="var(--orb-1)"
          />
        </svg>
      </motion.div>
    ))}
  </>
);

// ─── Particles overlay for Greenhouse ───
const ParticlesOverlay = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => {
        const colors = ["#86efac", "#4ade80", "#bbf7d0"];
        return {
          id: i,
          x: Math.random() * 100,
          size: 4 + Math.random() * 8,
          duration: 8 + Math.random() * 12,
          delay: Math.random() * 10,
          drift: (Math.random() - 0.5) * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.2 + Math.random() * 0.3,
          isLeaf: Math.random() > 0.6,
        };
      }),
    []
  );

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: "-5%",
            width: p.size,
            height: p.isLeaf ? p.size * 1.5 : p.size,
            borderRadius: p.isLeaf ? "50% 0 50% 0" : "50%",
            background: p.color,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -600],
            x: [0, p.drift],
            rotate: p.isLeaf ? [0, 180] : undefined,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            type: "tween",
            ease: "linear",
          }}
        />
      ))}
    </>
  );
};

const SpaceBackground = ({ space }: SpaceBackgroundProps) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {space.overlayType === "petals" && <PetalOverlay />}
      {space.overlayType === "flicker" && <FlickerOverlay />}
      {space.overlayType === "waves" && <WavesOverlay />}
      {space.overlayType === "particles" && <ParticlesOverlay />}
    </div>
  );
};

export default SpaceBackground;
