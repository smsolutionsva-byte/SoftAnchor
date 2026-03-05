import type { BodyState, MindState, HeartState, Frequency } from "@/types";

const FREQUENCIES: Frequency[] = [
  // ─── HEAVY heart combos → soft-static, maxTasks: 1 ───

  {
    id: "tense-foggy-heavy",
    name: "Deep Fog",
    tagline: "Wrapped in cotton today",
    emoji: "🌫️",
    theme: "soft-static",
    maxTasks: 1,
    affirmationCategory: "struggle",
    welcomeMessage:
      "The heaviest days deserve the gentlest pace. One tiny thing is enough.",
    color: "#c4b5fd",
  },
  {
    id: "tense-wandering-heavy",
    name: "Restless Storm",
    tagline: "So much swirling inside",
    emoji: "🌪️",
    theme: "soft-static",
    maxTasks: 1,
    affirmationCategory: "struggle",
    welcomeMessage:
      "Your body and mind are both asking for kindness right now. Just one step.",
    color: "#c4b5fd",
  },
  {
    id: "tense-focused-heavy",
    name: "Tight Wire",
    tagline: "Holding it together, barely",
    emoji: "🪡",
    theme: "soft-static",
    maxTasks: 1,
    affirmationCategory: "anxious",
    welcomeMessage:
      "You're focused but heavy. That takes strength. Let's keep it light today.",
    color: "#c4b5fd",
  },
  {
    id: "neutral-foggy-heavy",
    name: "Still Waters",
    tagline: "Quiet and a little distant",
    emoji: "🌙",
    theme: "soft-static",
    maxTasks: 1,
    affirmationCategory: "struggle",
    welcomeMessage:
      "Still waters run deep. You don't have to explain this day to anyone.",
    color: "#c4b5fd",
  },
  {
    id: "neutral-wandering-heavy",
    name: "Clouded Drift",
    tagline: "Moving through invisible weight",
    emoji: "☁️",
    theme: "soft-static",
    maxTasks: 1,
    affirmationCategory: "struggle",
    welcomeMessage:
      "Even drifting under clouds is movement. You're still going.",
    color: "#c4b5fd",
  },
  {
    id: "neutral-focused-heavy",
    name: "Quiet Carrying",
    tagline: "Functional but feeling it",
    emoji: "🎒",
    theme: "soft-static",
    maxTasks: 1,
    affirmationCategory: "struggle",
    welcomeMessage:
      "You're carrying more than anyone knows. One task is a victory.",
    color: "#c4b5fd",
  },
  {
    id: "relaxed-foggy-heavy",
    name: "Gentle Sinking",
    tagline: "Soft but weighed down",
    emoji: "🫧",
    theme: "soft-static",
    maxTasks: 1,
    affirmationCategory: "struggle",
    welcomeMessage:
      "Your body is resting but your heart needs care. Be extra gentle today.",
    color: "#c4b5fd",
  },
  {
    id: "relaxed-wandering-heavy",
    name: "Melancholy Float",
    tagline: "Peaceful outside, stormy inside",
    emoji: "🌊",
    theme: "soft-static",
    maxTasks: 1,
    affirmationCategory: "struggle",
    welcomeMessage:
      "Sometimes the calm outside makes the inside louder. That's okay.",
    color: "#c4b5fd",
  },
  {
    id: "relaxed-focused-heavy",
    name: "Steady Ache",
    tagline: "Clear-headed but heavy-hearted",
    emoji: "💎",
    theme: "soft-static",
    maxTasks: 1,
    affirmationCategory: "struggle",
    welcomeMessage:
      "You can see clearly and still feel heavy. Both are true today.",
    color: "#c4b5fd",
  },

  // ─── OKAY heart combos → gentle-drift, maxTasks: 2 ───

  {
    id: "tense-foggy-okay",
    name: "Quiet Haze",
    tagline: "Somewhere between lost and okay",
    emoji: "🕯️",
    theme: "soft-static",
    maxTasks: 1,
    affirmationCategory: "neutral",
    welcomeMessage:
      "A hazy day still counts as a day. Let's find just one soft step.",
    color: "#c4b5fd",
  },
  {
    id: "tense-wandering-okay",
    name: "Fizzy Static",
    tagline: "Buzzing but can't land anywhere",
    emoji: "⚡",
    theme: "gentle-drift",
    maxTasks: 2,
    affirmationCategory: "anxious",
    welcomeMessage:
      "All that buzzing energy? Let's give it one soft thing to land on.",
    color: "#f9a8d4",
  },
  {
    id: "tense-focused-okay",
    name: "Wired & Working",
    tagline: "A lot of energy, not sure where",
    emoji: "⚡",
    theme: "gentle-drift",
    maxTasks: 2,
    affirmationCategory: "anxious",
    welcomeMessage:
      "That nervous energy? Let's channel it into something small and real.",
    color: "#f9a8d4",
  },
  {
    id: "neutral-foggy-okay",
    name: "Soft Blur",
    tagline: "The world is a little fuzzy today",
    emoji: "🔮",
    theme: "gentle-drift",
    maxTasks: 2,
    affirmationCategory: "neutral",
    welcomeMessage:
      "Fuzzy days are still real days. Let's keep expectations soft.",
    color: "#f9a8d4",
  },
  {
    id: "neutral-wandering-okay",
    name: "Gentle Drift",
    tagline: "Floating between thoughts",
    emoji: "🌊",
    theme: "gentle-drift",
    maxTasks: 2,
    affirmationCategory: "neutral",
    welcomeMessage:
      "Wandering minds often find the best things. Let's anchor just a little.",
    color: "#f9a8d4",
  },
  {
    id: "neutral-focused-okay",
    name: "Steady Middle",
    tagline: "Not highs or lows, just steady",
    emoji: "⚖️",
    theme: "gentle-drift",
    maxTasks: 2,
    affirmationCategory: "neutral",
    welcomeMessage:
      "Steady is underrated. Let's make the most of this calm clarity.",
    color: "#f9a8d4",
  },
  {
    id: "relaxed-foggy-okay",
    name: "Sleepy Calm",
    tagline: "Cozy but a little slow today",
    emoji: "🛋️",
    theme: "gentle-drift",
    maxTasks: 2,
    affirmationCategory: "neutral",
    welcomeMessage:
      "Cozy and slow is a valid speed. Let's match your pace today.",
    color: "#f9a8d4",
  },
  {
    id: "relaxed-wandering-okay",
    name: "Daydream Lite",
    tagline: "Softly exploring possibilities",
    emoji: "💭",
    theme: "gentle-drift",
    maxTasks: 2,
    affirmationCategory: "neutral",
    welcomeMessage:
      "Your wandering is a kind of creativity. Let's capture one thread.",
    color: "#f9a8d4",
  },
  {
    id: "relaxed-focused-okay",
    name: "Soft Focus",
    tagline: "Calm and capable today",
    emoji: "🎯",
    theme: "gentle-drift",
    maxTasks: 2,
    affirmationCategory: "neutral",
    welcomeMessage:
      "Quiet capability is still capability. You've got this one.",
    color: "#f9a8d4",
  },

  // ─── LIGHT heart combos → golden-hour, maxTasks: 3 ───

  {
    id: "tense-foggy-light",
    name: "Bright Tension",
    tagline: "Heart's up but body's tight",
    emoji: "🌅",
    theme: "gentle-drift",
    maxTasks: 2,
    affirmationCategory: "anxious",
    welcomeMessage:
      "Your heart is light even when your body is tight. Let's move gently.",
    color: "#f9a8d4",
  },
  {
    id: "tense-wandering-light",
    name: "Excited Scatter",
    tagline: "So many sparks flying around",
    emoji: "🎆",
    theme: "golden-hour",
    maxTasks: 3,
    affirmationCategory: "thriving",
    welcomeMessage:
      "All those sparks? Let's catch the brightest ones and run with them.",
    color: "#86efac",
  },
  {
    id: "tense-focused-light",
    name: "Laser Beam",
    tagline: "Locked in and feeling it",
    emoji: "💫",
    theme: "golden-hour",
    maxTasks: 3,
    affirmationCategory: "thriving",
    welcomeMessage:
      "That intensity? It's a superpower today. Aim it at what matters most.",
    color: "#86efac",
  },
  {
    id: "neutral-foggy-light",
    name: "Soft Sunrise",
    tagline: "Waking up gently from the inside",
    emoji: "🌤️",
    theme: "gentle-drift",
    maxTasks: 2,
    affirmationCategory: "neutral",
    welcomeMessage:
      "Your heart is ahead of your mind today. Let the fog lift naturally.",
    color: "#f9a8d4",
  },
  {
    id: "neutral-wandering-light",
    name: "Butterfly Mode",
    tagline: "Flitting between ideas beautifully",
    emoji: "🦋",
    theme: "golden-hour",
    maxTasks: 3,
    affirmationCategory: "thriving",
    welcomeMessage:
      "Your brain is exploring today. Let's make sure something lands.",
    color: "#86efac",
  },
  {
    id: "neutral-focused-light",
    name: "Clear Sky",
    tagline: "Crisp, clear, ready to fly",
    emoji: "🌈",
    theme: "golden-hour",
    maxTasks: 3,
    affirmationCategory: "thriving",
    welcomeMessage:
      "Clear skies ahead. You have both the clarity and the heart for this.",
    color: "#86efac",
  },
  {
    id: "relaxed-foggy-light",
    name: "Dreamy Glow",
    tagline: "Soft and warm, like a lazy morning",
    emoji: "🌻",
    theme: "golden-hour",
    maxTasks: 3,
    affirmationCategory: "thriving",
    welcomeMessage:
      "You're in a dreamy glow today. Let beauty guide your steps.",
    color: "#86efac",
  },
  {
    id: "relaxed-wandering-light",
    name: "Daydream State",
    tagline: "Creative and soft today",
    emoji: "🌸",
    theme: "golden-hour",
    maxTasks: 3,
    affirmationCategory: "thriving",
    welcomeMessage:
      "Your wandering mind is a gift today. Let's give it gentle direction.",
    color: "#86efac",
  },
  {
    id: "relaxed-focused-light",
    name: "Golden Hour",
    tagline: "You're absolutely glowing",
    emoji: "✨",
    theme: "golden-hour",
    maxTasks: 3,
    affirmationCategory: "thriving",
    welcomeMessage:
      "This is your frequency today. Ride it gently — you're already winning.",
    color: "#86efac",
  },
];

export const getFrequency = (
  body: BodyState,
  mind: MindState,
  heart: HeartState
): Frequency => {
  const id = `${body}-${mind}-${heart}`;
  const found = FREQUENCIES.find((f) => f.id === id);
  // Fallback to Gentle Drift
  return (
    found ??
    FREQUENCIES.find((f) => f.id === "neutral-wandering-okay")!
  );
};

export default FREQUENCIES;
