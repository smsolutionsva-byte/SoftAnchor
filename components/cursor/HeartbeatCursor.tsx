"use client";

import { useState, useEffect } from "react";
import { motion, useTransform } from "motion/react";
import useHeartbeat from "@/hooks/useHeartbeat";
import { useAnchorStore } from "@/store/useAnchorStore";

const HeartbeatCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const cursorVisible = useAnchorStore((s) => s.cursorVisible);
  const { smoothX, smoothY, breathScale, cursorColor } = useHeartbeat();

  const outerScale = useTransform(breathScale, (v: number) => v * 1.5);
  const middleScale = useTransform(breathScale, (v: number) => v * 1.1);

  useEffect(() => {
    setMounted(true);
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);

    if (!touch) {
      document.body.classList.add("heartbeat-cursor-active");
    }

    return () => {
      document.body.classList.remove("heartbeat-cursor-active");
    };
  }, []);

  if (!mounted || isTouch || !cursorVisible) return null;

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: `1px solid ${cursorColor}4d`,
          scale: outerScale,
          opacity: 0.3,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      {/* Middle ring */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${cursorColor}66, transparent)`,
          scale: middleScale,
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      {/* Inner dot */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: cursorColor,
          scale: breathScale,
          opacity: 0.9,
          filter: "blur(0.5px)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
};

export default HeartbeatCursor;
