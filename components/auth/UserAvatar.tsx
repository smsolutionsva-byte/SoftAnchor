"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import SignOutButton from "@/components/auth/SignOutButton";

export default function UserAvatar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initial = user.displayName?.[0]?.toUpperCase() ?? "?";
  const photoURL = user.photoURL;

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden
                   cursor-pointer border-2 select-none"
        style={{
          borderColor: "var(--accent-primary)",
          background: photoURL ? "transparent" : "var(--glass-bg)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoURL}
            alt={user.displayName ?? "User"}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {initial}
          </span>
        )}
      </motion.button>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-12 z-50 min-w-[200px] rounded-2xl p-4 flex flex-col gap-3"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            }}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, type: "tween" }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Hi, {user.displayName?.split(" ")[0] ?? "friend"} 💛
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "var(--text-muted)" }}
            >
              {user.email}
            </p>

            <div
              className="h-px w-full"
              style={{ background: "var(--glass-border)" }}
            />

            <SignOutButton onDone={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
