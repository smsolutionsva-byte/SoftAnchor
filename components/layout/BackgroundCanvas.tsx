"use client";

import { motion } from "motion/react";

const BackgroundCanvas = () => {
  const noiseDataUri = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          overflow: "hidden",
          position: "absolute",
          inset: 0,
        }}
      >
        {/* Orb 1 */}
        <motion.div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "var(--orb-1)",
            opacity: 0.35,
            filter: "blur(90px)",
          }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 22,
            type: "tween",
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Orb 2 */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "-15%",
            right: "-8%",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background: "var(--orb-2)",
            opacity: 0.25,
            filter: "blur(90px)",
          }}
          animate={{
            x: [0, -30, 50, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 18,
            type: "tween",
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Orb 3 */}
        <motion.div
          style={{
            position: "absolute",
            top: "40%",
            right: "20%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "var(--accent)",
            opacity: 0.12,
            filter: "blur(90px)",
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.85, 1],
          }}
          transition={{
            duration: 25,
            type: "tween",
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>

      {/* Noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: noiseDataUri,
          opacity: 0.025,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default BackgroundCanvas;
