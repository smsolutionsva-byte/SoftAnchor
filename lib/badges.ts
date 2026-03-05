import type { Badge } from "@/types";

export const BADGES: Badge[] = [
  {
    id: "first-anchor",
    name: "First Anchor",
    emoji: "⚓",
    description: "you showed up",
    requiredWins: 1,
    unlockedAt: null,
    message:
      "You opened this app and did one thing. That's not small. That's the whole thing.",
  },
  {
    id: "three-days",
    name: "Soft Three",
    emoji: "🌱",
    description: "3 days of something",
    requiredWins: 3,
    unlockedAt: null,
    message:
      "Three days in a row of showing up in some way. A tiny habit is being born.",
  },
  {
    id: "one-week",
    name: "Gentle Week",
    emoji: "🌸",
    description: "7 days with your anchor",
    requiredWins: 7,
    unlockedAt: null,
    message:
      "A whole week. Not perfect — better than perfect. Real.",
  },
  {
    id: "two-weeks",
    name: "Soft Momentum",
    emoji: "🌊",
    description: "14 days flowing",
    requiredWins: 14,
    unlockedAt: null,
    message:
      "Two weeks of coming back. Your brain is learning that it can.",
  },
  {
    id: "three-weeks",
    name: "New Normal",
    emoji: "🌿",
    description: "21 days — it's a habit now",
    requiredWins: 21,
    unlockedAt: null,
    message:
      "21 days. Science says habits form here. Your heart knew before science did.",
  },
  {
    id: "one-month",
    name: "Golden Month",
    emoji: "✨",
    description: "30 days of gentle consistency",
    requiredWins: 30,
    unlockedAt: null,
    message:
      "A whole month. You built something. You ARE the evidence.",
  },
  {
    id: "fifty-wins",
    name: "Soft Fifty",
    emoji: "💜",
    description: "50 soft wins logged",
    requiredWins: 50,
    unlockedAt: null,
    message:
      "Fifty moments where you chose yourself. That number is not an accident.",
  },
  {
    id: "century",
    name: "Century of Care",
    emoji: "🌟",
    description: "100 soft wins",
    requiredWins: 100,
    unlockedAt: null,
    message:
      "One hundred times you came back. This is what devotion to yourself looks like.",
  },
];

const STREAK_BADGE_IDS = [
  "three-days",
  "one-week",
  "two-weeks",
  "three-weeks",
  "one-month",
];

export function checkBadgeUnlock(
  totalWins: number,
  currentStreak: number,
  unlockedBadges: Badge[]
): Badge | null {
  const unlockedIds = unlockedBadges.map((b) => b.id);

  // Check streak-based badges
  const streakBadge = BADGES.find(
    (b) =>
      !unlockedIds.includes(b.id) &&
      STREAK_BADGE_IDS.includes(b.id) &&
      currentStreak >= b.requiredWins
  );
  if (streakBadge) return streakBadge;

  // Check total wins badges
  const winsBadge = BADGES.find(
    (b) =>
      !unlockedIds.includes(b.id) &&
      !STREAK_BADGE_IDS.includes(b.id) &&
      totalWins >= b.requiredWins
  );
  return winsBadge ?? null;
}
