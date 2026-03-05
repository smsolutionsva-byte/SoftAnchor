"use client";

import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import BackgroundCanvas from "@/components/layout/BackgroundCanvas";

const FEATURE_PILLS = [
  { emoji: "🧠", text: "ADHD-first task breakdown" },
  { emoji: "💛", text: "Gentle check-ins" },
  { emoji: "🌸", text: "Overwhelm sanctuary" },
  { emoji: "✨", text: "Soft celebrations" },
];

export default function SignInScreen() {
  const { signIn, isSigningIn, error } = useAuth();

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, type: "tween" }}
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundCanvas />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-md w-full">
        {/* Wordmark */}
        <motion.h1
          className="font-[var(--font-display)] text-5xl md:text-6xl font-bold italic"
          style={{ color: "var(--text-primary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.8, type: "tween" }}
        >
          SoftAnchor
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-lg md:text-xl text-center font-light"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, type: "tween" }}
        >
          Your brain&apos;s gentle GPS 💜
        </motion.p>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, type: "tween" }}
        >
          {FEATURE_PILLS.map((pill) => (
            <span
              key={pill.text}
              className="px-4 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-secondary)",
              }}
            >
              {pill.emoji} {pill.text}
            </span>
          ))}
        </motion.div>

        {/* Error display */}
        {error && (
          <motion.p
            className="text-sm text-center px-4 py-2 rounded-xl"
            style={{
              background: "rgba(255,200,200,0.15)",
              color: "var(--text-primary)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        {/* Sign in button */}
        <motion.button
          onClick={signIn}
          disabled={isSigningIn}
          className="flex items-center gap-3 px-8 py-3.5 rounded-2xl text-base font-medium cursor-pointer
                     transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-primary)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, type: "tween" }}
          whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Google Logo SVG */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          {isSigningIn ? "Signing in..." : "Continue with Google"}
        </motion.button>

        {/* Privacy note */}
        <motion.p
          className="text-xs text-center max-w-xs"
          style={{ color: "var(--text-muted)", opacity: 0.7 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.3, duration: 0.6, type: "tween" }}
        >
          Your data stays private. We only use your name & email to personalize
          your experience 💛
        </motion.p>
      </div>
    </motion.div>
  );
}
