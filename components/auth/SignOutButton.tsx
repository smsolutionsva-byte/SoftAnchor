"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onDone?: () => void;
}

export default function SignOutButton({ onDone }: Props) {
  const { signOut } = useAuth();
  const [confirming, setConfirming] = useState(false);

  const handleClick = async () => {
    if (!confirming) {
      setConfirming(true);
      // Auto-reset after 3s
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    await signOut();
    onDone?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors"
      style={{
        background: confirming
          ? "rgba(255, 120, 120, 0.15)"
          : "var(--glass-bg)",
        color: confirming ? "#e05555" : "var(--text-secondary)",
        border: `1px solid ${confirming ? "rgba(255,120,120,0.3)" : "var(--glass-border)"}`,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {confirming ? "Are you sure? 💛" : "Sign out"}
    </motion.button>
  );
}
