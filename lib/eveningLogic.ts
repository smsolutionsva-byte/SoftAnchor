export function isEveningTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 19 && hour <= 23;
}

export function getEveningGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 20) return "winding down 🌆";
  if (hour < 22) return "evening light 🌙";
  return "almost time to rest 🌛";
}

export const REFLECTION_PROMPTS = [
  "what did you actually do today, even the tiny things?",
  "what's one thing your body did today that you're grateful for?",
  "what moments today felt even a little bit okay?",
  "what did you handle today — even imperfectly?",
  "if you were your own best friend, what would you tell yourself about today?",
];

export const TOMORROW_WHISPERS = [
  "just one soft thing to think about overnight (no pressure to do it):",
  "if tomorrow had one gentle intention, what might it be?",
  "what's one thing tomorrow-you might be glad you thought about tonight?",
];

export const BEDTIME_AFFIRMATIONS = [
  "You did enough today. Even if it didn't feel like it.",
  "Rest is not laziness. It's how you come back tomorrow.",
  "Whatever you didn't finish today is still okay. It will wait.",
  "You were human today. That's not a flaw. That's everything.",
  "Sleep now. Your anchor holds even while you rest.",
  "Tomorrow is a fresh page. Tonight, put down the pen.",
  "You showed up today in whatever way you could. That counts.",
  "Your brain worked hard today. Let it rest now. It deserves it.",
];

export function getTomorrowTask(
  tasks: { title: string; status: string }[]
): string | null {
  const pending = tasks.filter(
    (t) => t.status === "pending" || t.status === "skipped"
  );
  return pending[0]?.title ?? null;
}
