"use client";

import { motion } from "motion/react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: string;
  delay?: number;
}

const GlassCard = ({
  children,
  className,
  onClick,
  padding = "32px",
  delay = 0,
}: GlassCardProps) => {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow:
          "0 8px 32px var(--shadow), inset 0 1px 0 rgba(255,255,255,0.05)",
        padding,
        cursor: onClick ? "pointer" : undefined,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.01,
        boxShadow: "0 12px 48px var(--shadow)",
      }}
      whileTap={onClick ? { scale: 0.99 } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
