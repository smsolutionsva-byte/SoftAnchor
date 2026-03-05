"use client";

import { motion } from "motion/react";

interface AmbientOrbProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  blur?: number;
  opacity?: number;
  animate?: boolean;
}

const AmbientOrb = ({
  size = 8,
  color = "var(--accent)",
  style,
  blur = 4,
  opacity = 0.6,
  animate: shouldAnimate = false,
}: AmbientOrbProps) => {
  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    background: color,
    filter: `blur(${blur}px)`,
    opacity,
    ...style,
  };

  if (shouldAnimate) {
    return (
      <motion.div
        style={baseStyle}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [opacity, opacity * 0.5, opacity],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          type: "tween",
          ease: "easeInOut",
        }}
      />
    );
  }

  return <div style={baseStyle} />;
};

export default AmbientOrb;
