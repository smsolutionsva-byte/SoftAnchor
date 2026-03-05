import type { BreathingPattern } from "@/types";

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "steady and grounding",
    emoji: "⬜",
    cycles: 4,
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
  },
  {
    id: "478",
    name: "4-7-8 Calm",
    description: "deep nervous system reset",
    emoji: "🌊",
    cycles: 3,
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
  },
  {
    id: "soft",
    name: "Soft Breath",
    description: "gentle, no holding",
    emoji: "🌸",
    cycles: 5,
    inhale: 4,
    holdIn: 0,
    exhale: 6,
    holdOut: 0,
  },
  {
    id: "quick",
    name: "Quick Reset",
    description: "just 2 cycles, fast relief",
    emoji: "⚡",
    cycles: 2,
    inhale: 3,
    holdIn: 0,
    exhale: 5,
    holdOut: 0,
  },
];

export const DEFAULT_PATTERN = BREATHING_PATTERNS[2]; // soft breath

export function getTotalDuration(pattern: BreathingPattern): number {
  const cycleLength =
    pattern.inhale + pattern.holdIn + pattern.exhale + pattern.holdOut;
  return cycleLength * pattern.cycles;
}
