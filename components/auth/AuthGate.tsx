"use client";

import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import SignInScreen from "@/components/auth/SignInScreen";

/**
 * Wraps children in an auth gate.
 * Shows a breathing orb while loading,
 * SignInScreen if not signed in,
 * children if authenticated.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Loading state – gentle breathing orb
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-primary)]">
        <motion.div
          className="w-16 h-16 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            type: "tween",
          }}
        />
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <SignInScreen key="sign-in" />
      </AnimatePresence>
    );
  }

  // Authenticated
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, type: "tween" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
