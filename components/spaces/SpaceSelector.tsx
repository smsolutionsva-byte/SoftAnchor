"use client";

import { motion, AnimatePresence } from "motion/react";
import useSoftSpace from "@/hooks/useSoftSpace";
import { SOFT_SPACES } from "@/lib/softSpaces";
import { useAnchorStore } from "@/store/useAnchorStore";
import type { SoftSpaceId } from "@/types";

const SpaceSelector = () => {
  const { space, setSpace, isTransitioning } = useSoftSpace();
  const spaceAudioEnabled = useAnchorStore((s) => s.spaceAudioEnabled);
  const setSpaceAudioEnabled = useAnchorStore((s) => s.setSpaceAudioEnabled);
  const spaceAudioVolume = useAnchorStore((s) => s.spaceAudioVolume);
  const setSpaceAudioVolume = useAnchorStore((s) => s.setSpaceAudioVolume);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {SOFT_SPACES.map((s) => {
          const isActive = space.id === s.id;
          return (
            <motion.button
              key={s.id}
              onClick={() => setSpace(s.id as SoftSpaceId)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
                background: isActive ? "var(--glass-bg)" : "var(--glass-bg)",
                color: isActive
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
                boxShadow: isActive
                  ? `0 0 0 1px ${s.cursorColor}, 0 0 12px ${s.cursorColor}40`
                  : "none",
                transition: "all 0.3s ease",
              }}
            >
              {s.emoji} {s.name}
            </motion.button>
          );
        })}

        {/* Audio toggle */}
        <motion.button
          onClick={() => setSpaceAudioEnabled(!spaceAudioEnabled)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "6px 10px",
            borderRadius: "9999px",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            border: "1px solid var(--glass-border)",
            cursor: "pointer",
            background: "var(--glass-bg)",
            color: "var(--text-muted)",
          }}
        >
          {spaceAudioEnabled ? "🔊" : "🔇"}
        </motion.button>

        {spaceAudioEnabled && (
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={spaceAudioVolume}
            onChange={(e) => setSpaceAudioVolume(parseFloat(e.target.value))}
            style={{
              width: 60,
              accentColor: space.cursorColor,
              opacity: 0.6,
            }}
          />
        )}
      </div>

      {/* Transition flash */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, type: "tween" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: space.cursorColor,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SpaceSelector;
