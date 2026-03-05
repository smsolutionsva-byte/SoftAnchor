"use client";

import { motion } from "motion/react";
import useDailyReset from "@/hooks/useDailyReset";
import MorningRitual from "./MorningRitual";
import { useState } from "react";

interface CheckInGateProps {
  children: React.ReactNode;
}

const CheckInGate = ({ children }: CheckInGateProps) => {
  const { needsCheckIn, isLoading } = useDailyReset();
  const [ritualComplete, setRitualComplete] = useState(false);

  // Loading state — soft pulsing orb
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            type: "tween",
            ease: "easeInOut",
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "var(--accent)",
            filter: "blur(1px)",
            boxShadow: "0 0 40px var(--accent-soft)",
          }}
        />
      </div>
    );
  }

  // Show morning ritual if check-in needed and not yet completed this session
  if (needsCheckIn && !ritualComplete) {
    return <MorningRitual onComplete={() => setRitualComplete(true)} />;
  }

  // Main app content
  return <>{children}</>;
};

export default CheckInGate;
