export const GENTLE_COPY = {
  taskInput: {
    placeholder: [
      "what's sitting on your heart today?",
      "what's one thing swirling around in your head?",
      "is there something you keep putting off? let's make it tiny",
      "what would feel amazing to finally start?",
      "tell me what's feeling big right now...",
    ],
    buttonIdle: "let's break this down 🌸",
    buttonLoading: "thinking gently...",
    buttonTooShort: "tell me a tiny bit more 💭",
  },

  taskStatus: {
    completed: [
      "You did that. YOU did that. 💛",
      "Look at you go 🌸",
      "That just happened and it was you 💜",
      "Checked off. Glowed up. That's the move ✨",
      "Soft win recorded forever 🫧",
    ],
    skipped: [
      "It's okay, it'll still be here whenever you're ready 🌿",
      "Skipping is a valid choice, not a failure 💜",
      "We can come back to this. No pressure 🌸",
    ],
    stepDone: [
      "One down 🌟",
      "Yes, that 💛",
      "Keep going, you're doing it 🌸",
      "Tiny win. Real win. ✨",
      "That step? Done. You? Amazing 💜",
    ],
    allStepsDone: "Every step. You completed every single step 💜",
  },

  breakdown: {
    loading: [
      "finding the gentlest way through this...",
      "making it smaller, just for you...",
      "turning this into something soft...",
      "breaking this down with care...",
    ],
    error: "It's okay, we can try again 💛",
    tooVague: "Can you tell me just a tiny bit more? 🌸",
    alreadyTiny: "This is already so small — you've got this 💪",
  },

  emptyState: {
    morning: "what's one thing that would make today feel okay? 🌸",
    afternoon: "what's still sitting on your mind? 🌿",
    evening: "one last soft thing before you wind down? 🌙",
    afterComplete: "look at you, all caught up ✨ rest is productive too",
  },

  maxTasksReached: {
    low: "that's enough for now. one thing at a time 💜",
    medium: "two things is already a lot. you're doing great 🌸",
    high: "three is your soft limit today — quality over quantity ✨",
  },

  encouragement: {
    firstTask: "adding your first anchor 🌸",
    secondTask: "another soft step 💜",
    thirdTask: "look at you planning your day ✨",
  },
};

export function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTimeBasedEmpty(): string {
  const hour = new Date().getHours();
  if (hour < 12) return GENTLE_COPY.emptyState.morning;
  if (hour < 17) return GENTLE_COPY.emptyState.afternoon;
  return GENTLE_COPY.emptyState.evening;
}

export function getMaxTasksMessage(max: number): string {
  if (max === 1) return GENTLE_COPY.maxTasksReached.low;
  if (max === 2) return GENTLE_COPY.maxTasksReached.medium;
  return GENTLE_COPY.maxTasksReached.high;
}
