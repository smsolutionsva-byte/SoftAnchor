"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SanctuaryTab } from "@/types";

interface SanctuaryShellProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: SanctuaryTab;
  onTabChange: (tab: SanctuaryTab) => void;
  children: ReactNode;
}

const TABS: { id: SanctuaryTab; label: string; emoji: string }[] = [
  { id: "breathing", label: "Breathe", emoji: "🌬️" },
  { id: "braindump", label: "Brain Dump", emoji: "🧠" },
  { id: "tinywin", label: "Tiny Win", emoji: "🌟" },
  { id: "kindness", label: "Kindness", emoji: "💛" },
];

const SanctuaryShell = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  children,
}: SanctuaryShellProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Modal — full‑height sheet on mobile, centred card on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 26,
            }}
            className="relative w-full rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
            style={{
              maxWidth: 560,
              maxHeight: "92vh",
              height: "auto",
              background: "var(--bg-secondary)",
              border: "1px solid var(--glass-border)",
              boxShadow:
                "0 -4px 40px rgba(0,0,0,0.2), 0 25px 50px -12px rgba(0,0,0,0.15)",
            }}
          >
            {/* Drag handle (mobile feel) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: "var(--glass-border)" }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 sm:pt-5 pb-2">
              <p
                className="text-sm font-body"
                style={{ color: "var(--text-muted)" }}
              >
                your safe space 🫧
              </p>
              <button
                onClick={onClose}
                className="text-sm font-body cursor-pointer bg-transparent border-none px-2 py-1 rounded-lg transition-colors duration-200"
                style={{ color: "var(--text-muted)" }}
              >
                close ✕
              </button>
            </div>

            {/* Tab pills */}
            <div className="flex gap-2 px-6 pb-4 pt-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className="flex-1 py-2.5 px-2 rounded-2xl text-xs font-body cursor-pointer transition-all duration-200"
                    style={{
                      background: isActive
                        ? "var(--accent)"
                        : "var(--glass-bg)",
                      color: isActive ? "white" : "var(--text-secondary)",
                      border: isActive
                        ? "1px solid transparent"
                        : "1px solid var(--glass-border)",
                      boxShadow: isActive
                        ? "0 4px 14px var(--accent-soft)"
                        : "none",
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <span className="block text-base leading-tight">
                      {tab.emoji}
                    </span>
                    <span className="block mt-1 text-[11px] leading-tight">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Soft divider */}
            <div
              className="mx-6 h-px"
              style={{ background: "var(--glass-border)", opacity: 0.5 }}
            />

            {/* Tab content */}
            <div
              className="flex-1 overflow-y-auto px-6 py-5"
              style={{ minHeight: 340 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SanctuaryShell;
