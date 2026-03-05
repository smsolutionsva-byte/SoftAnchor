import type { Theme, ThemeVariant } from "@/types";

export const THEMES: Theme[] = [
  {
    id: "soft-static",
    label: "Soft Static",
    emoji: "🌙",
    moodLabel: "low energy",
    description: "It's okay to move slowly today",
    vars: {},
  },
  {
    id: "gentle-drift",
    label: "Gentle Drift",
    emoji: "🌸",
    moodLabel: "okay-ish",
    description: "You're doing better than you think",
    vars: {},
  },
  {
    id: "golden-hour",
    label: "Golden Hour",
    emoji: "✨",
    moodLabel: "let's go!",
    description: "You're glowing today, let's ride this!",
    vars: {},
  },
];

export const getTheme = (id: ThemeVariant): Theme => {
  return THEMES.find((t) => t.id === id) ?? THEMES[1];
};
