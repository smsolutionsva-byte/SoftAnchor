import type { SoftSpace, SoftSpaceId } from "@/types";

export const SOFT_SPACES: SoftSpace[] = [
  {
    id: "sakura",
    name: "Sakura Study",
    emoji: "🌸",
    tagline: "soft pink, petals drifting, lo-fi warmth",
    themeOverride: {
      "--orb-1": "#c084fc",
      "--orb-2": "#f9a8d4",
      "--accent": "#f472b6",
      "--accent-soft": "rgba(244, 114, 182, 0.15)",
      "--glass-border": "rgba(244, 114, 182, 0.2)",
    },
    overlayType: "petals",
    audioSrc: null,
    audioLabel: "lo-fi rain",
    cursorColor: "#f9a8d4",
    backgroundGradient:
      "radial-gradient(ellipse at 20% 50%, #2d1640 0%, #1a0f2e 100%)",
  },
  {
    id: "candlelit",
    name: "Candlelit Nook",
    emoji: "🕯️",
    tagline: "warm amber glow, flickering light, fireplace crackle",
    themeOverride: {
      "--orb-1": "#d97706",
      "--orb-2": "#92400e",
      "--accent": "#fcd34d",
      "--accent-soft": "rgba(252, 211, 77, 0.15)",
      "--glass-border": "rgba(252, 211, 77, 0.18)",
    },
    overlayType: "flicker",
    audioSrc: null,
    audioLabel: "fireplace",
    cursorColor: "#fcd34d",
    backgroundGradient:
      "radial-gradient(ellipse at 30% 70%, #2d1b00 0%, #0f0a00 100%)",
  },
  {
    id: "ocean",
    name: "Ocean Desk",
    emoji: "🌊",
    tagline: "airy blues, slow waves, distant shore sounds",
    themeOverride: {
      "--orb-1": "#0ea5e9",
      "--orb-2": "#0369a1",
      "--accent": "#7dd3fc",
      "--accent-soft": "rgba(125, 211, 252, 0.15)",
      "--glass-border": "rgba(125, 211, 252, 0.18)",
    },
    overlayType: "waves",
    audioSrc: null,
    audioLabel: "ocean waves",
    cursorColor: "#7dd3fc",
    backgroundGradient:
      "radial-gradient(ellipse at 50% 80%, #0c2340 0%, #040d1a 100%)",
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    emoji: "🌿",
    tagline: "lush greens, drifting botanical particles, birds",
    themeOverride: {
      "--orb-1": "#16a34a",
      "--orb-2": "#065f46",
      "--accent": "#86efac",
      "--accent-soft": "rgba(134, 239, 172, 0.15)",
      "--glass-border": "rgba(134, 239, 172, 0.18)",
    },
    overlayType: "particles",
    audioSrc: null,
    audioLabel: "wind & birds",
    cursorColor: "#86efac",
    backgroundGradient:
      "radial-gradient(ellipse at 70% 30%, #052e16 0%, #020f07 100%)",
  },
];

export const DEFAULT_SPACE: SoftSpaceId = "sakura";

export function getSpace(id: SoftSpaceId): SoftSpace {
  return SOFT_SPACES.find((s) => s.id === id) ?? SOFT_SPACES[0];
}
