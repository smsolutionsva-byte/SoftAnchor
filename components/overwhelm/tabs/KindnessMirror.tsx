"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getAffirmationForFrequency,
  getRandomAffirmation,
} from "@/lib/affirmations";
import { useAnchorStore } from "@/store/useAnchorStore";

const CATEGORIES = [
  { id: "all", label: "all", emoji: "✨" },
  { id: "struggle", label: "struggle", emoji: "🌧️" },
  { id: "neutral", label: "neutral", emoji: "🌤️" },
  { id: "anxious", label: "anxious", emoji: "🌊" },
  { id: "thriving", label: "thriving", emoji: "🌈" },
] as const;

type CategoryFilter = (typeof CATEGORIES)[number]["id"];

const KindnessMirror = () => {
  const frequency = useAnchorStore((s) => s.currentFrequency);
  const savedAffirmations = useAnchorStore((s) => s.savedAffirmations);
  const saveAffirmation = useAnchorStore((s) => s.saveAffirmation);
  const removeSavedAffirmation = useAnchorStore(
    (s) => s.removeSavedAffirmation
  );
  const updateSession = useAnchorStore((s) => s.updateSession);

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [affirmation, setAffirmation] = useState("");
  const [revealKey, setRevealKey] = useState(0);
  const [showSaved, setShowSaved] = useState(false);

  // Initial affirmation based on frequency
  useEffect(() => {
    if (frequency) {
      setAffirmation(getAffirmationForFrequency(frequency));
    } else {
      setAffirmation(getRandomAffirmation("neutral"));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const words = useMemo(() => affirmation.split(" "), [affirmation]);

  const refresh = useCallback(() => {
    let newAffirmation: string;
    if (category === "all") {
      const cats = ["struggle", "neutral", "anxious", "thriving"] as const;
      const randomCat = cats[Math.floor(Math.random() * cats.length)];
      newAffirmation = getRandomAffirmation(randomCat);
    } else {
      newAffirmation = getRandomAffirmation(category);
    }
    setAffirmation(newAffirmation);
    setRevealKey((k) => k + 1);
  }, [category]);

  const handleSave = useCallback(() => {
    saveAffirmation(affirmation);
    updateSession({ affirmationSaved: true });
  }, [affirmation, saveAffirmation, updateSession]);

  const isSaved = savedAffirmations.includes(affirmation);

  return (
    <div className="flex flex-col items-center gap-5">
      <p
        className="text-sm font-body text-center"
        style={{ color: "var(--text-secondary)" }}
      >
        words your heart needs to hear right now 💛
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setCategory(cat.id);
            }}
            className="px-2.5 py-1 rounded-full text-xs font-body cursor-pointer border-none transition-all duration-200"
            style={{
              background:
                category === cat.id ? "var(--accent)" : "var(--glass-bg)",
              color:
                category === cat.id ? "white" : "var(--text-secondary)",
              border:
                category === cat.id
                  ? "none"
                  : "1px solid var(--glass-border)",
            }}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Affirmation reveal */}
      <div
        className="w-full rounded-2xl p-6 flex flex-wrap justify-center gap-x-1.5 gap-y-1"
        style={{
          minHeight: 100,
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={revealKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap justify-center gap-x-1.5 gap-y-1"
          >
            {words.map((word, i) => (
              <motion.span
                key={`${revealKey}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.06,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="text-base font-display"
                style={{ color: "var(--text-primary)" }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          onClick={refresh}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 rounded-xl text-sm font-body cursor-pointer"
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
            border: "1px solid var(--glass-border)",
          }}
        >
          another 🔄
        </motion.button>

        <motion.button
          onClick={handleSave}
          disabled={isSaved}
          whileHover={{ scale: isSaved ? 1 : 1.05 }}
          whileTap={{ scale: isSaved ? 1 : 0.95 }}
          className="px-5 py-2 rounded-xl text-sm font-body cursor-pointer border-none"
          style={{
            background: isSaved ? "var(--glass-bg)" : "var(--accent)",
            color: isSaved ? "var(--text-muted)" : "white",
          }}
        >
          {isSaved ? "saved ✓" : "keep this 💕"}
        </motion.button>
      </div>

      {/* Saved affirmations toggle */}
      {savedAffirmations.length > 0 && (
        <div className="w-full">
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="text-xs font-body cursor-pointer bg-transparent border-none w-full text-center"
            style={{ color: "var(--text-muted)" }}
          >
            {showSaved ? "hide" : "show"} saved affirmations (
            {savedAffirmations.length})
          </button>

          <AnimatePresence>
            {showSaved && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 flex flex-col gap-2 overflow-hidden"
              >
                {savedAffirmations.map((aff) => (
                  <div
                    key={aff}
                    className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <p
                      className="text-xs font-body flex-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {aff}
                    </p>
                    <button
                      onClick={() => removeSavedAffirmation(aff)}
                      className="text-xs cursor-pointer bg-transparent border-none ml-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default KindnessMirror;
