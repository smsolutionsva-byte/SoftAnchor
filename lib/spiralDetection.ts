export interface SpiralCheckInput {
  overwhelmCount: number;
  lastOverwhelmAt: string | null;
  recentTaskActions: { type: string; timestamp: string }[];
}

export function checkForSpiral(input: SpiralCheckInput): boolean {
  const { overwhelmCount, lastOverwhelmAt, recentTaskActions } = input;

  // Rule 1: Opened overwhelm sanctuary 3+ times today
  if (overwhelmCount >= 3) return true;

  // Rule 2: Rapid task add then delete (5+ actions in 2 minutes)
  const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
  const recentActions = recentTaskActions.filter(
    (a) => new Date(a.timestamp).getTime() > twoMinutesAgo
  );
  if (recentActions.length >= 5) return true;

  // Rule 3: Overwhelm within 10 minutes of last overwhelm
  if (lastOverwhelmAt) {
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    if (
      new Date(lastOverwhelmAt).getTime() > tenMinutesAgo &&
      overwhelmCount >= 2
    )
      return true;
  }

  return false;
}

export function getSpiralMessage(): {
  title: string;
  body: string;
  pauseLabel: string;
  continueLabel: string;
} {
  const messages = [
    {
      title: "hey, I noticed something 🌀",
      body: "It looks like your brain might be spinning a little right now. That's okay — it happens to everyone. Want to pause everything and just breathe for a minute?",
      pauseLabel: "yes, let me pause 🫧",
      continueLabel: "I'm okay, keep going 💪",
    },
    {
      title: "gentle check-in 🌸",
      body: "You've reached for the overwhelm button a few times today. Your feelings are completely valid. Would a breathing moment help right now?",
      pauseLabel: "yes please 🫁",
      continueLabel: "I'm alright, thanks 💛",
    },
    {
      title: "your anchor noticed 💜",
      body: "Seems like today might be a lot. That's not a problem — it's just information. The tasks will wait. You matter more than any of them.",
      pauseLabel: "take me to the breathing room",
      continueLabel: "I've got this 🌿",
    },
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
