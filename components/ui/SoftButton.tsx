"use client";

import { motion } from "motion/react";
import type { ButtonVariant } from "@/types";

interface SoftButtonProps extends ButtonVariant {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const SIZE_MAP = {
  sm: { padding: "8px 20px", fontSize: "13px" },
  md: { padding: "12px 28px", fontSize: "15px" },
  lg: { padding: "16px 36px", fontSize: "17px" },
} as const;

const getVariantStyles = (variant: "primary" | "ghost" | "danger") => {
  switch (variant) {
    case "ghost":
      return {
        background: "transparent",
        border: "1px solid var(--accent)",
        color: "var(--accent)",
      };
    case "danger":
      return {
        background: "rgba(251, 113, 133, 0.1)",
        border: "1px solid rgba(251, 113, 133, 0.4)",
        color: "#fb7185",
      };
    case "primary":
    default:
      return {
        background: "var(--accent-soft)",
        border: "1px solid var(--accent)",
        color: "var(--accent)",
      };
  }
};

const SoftButton = ({
  children,
  onClick,
  disabled = false,
  className,
  type = "button",
  variant = "primary",
  size = "md",
}: SoftButtonProps) => {
  const sizeStyles = SIZE_MAP[size];
  const variantStyles = getVariantStyles(variant);

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...variantStyles,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        borderRadius: "var(--radius-full)",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.02em",
        opacity: disabled ? 0.5 : 1,
        outline: "none",
        transition: "var(--transition-soft)",
      }}
      whileHover={
        disabled
          ? undefined
          : {
              scale: 1.04,
              filter: "brightness(1.15)",
              boxShadow:
                "0 0 20px var(--accent), 0 0 40px var(--accent-soft)",
            }
      }
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};

export default SoftButton;
