import type { Frequency } from "@/types";

const AFFIRMATIONS: Record<string, string[]> = {
  struggle: [
    "Your brain was busy protecting you. It's not lazy. It's loyal.",
    "You forgot something again and that means nothing about your worth.",
    "Heavy days aren't failed days. They're human days.",
    "You are not behind. You are exactly where your body needed to bring you.",
    "It's okay if today is just about surviving. That counts.",
    "Rest is not something you earn. It's something you deserve.",
    "The fact that you opened this app? That's already something. 💜",
    "You don't have to perform okayness today.",
    "Some days the win is just being gentle with yourself.",
    "Struggling doesn't make you broken. It makes you real.",
    "You've gotten through every hard day so far. This one too.",
    "Your worth is not your output.",
  ],
  neutral: [
    "Neutral is valid. Not every day needs a vibe.",
    "You're doing better than you think, even when it doesn't feel like it.",
    "Progress isn't always visible, but it's still real.",
    "Showing up halfway still counts as showing up.",
    "One small step is not a small thing.",
    "You don't need to be inspired to be productive.",
    "Ordinary days build extraordinary lives.",
    "Doing it imperfectly is still doing it.",
    "You're allowed to just be okay today.",
    "Momentum starts with the tiniest movement.",
    "Your middle days matter just as much as your peak days.",
    "You are enough, even on a meh day.",
  ],
  anxious: [
    "That spiral in your head? It's just your brain trying to keep you safe.",
    "Anxiety is not a character flaw. It's your nervous system working overtime.",
    "You don't have to solve everything right now.",
    "One thing. Just one thing is all we need today.",
    "The overwhelm is real. AND you are capable. Both are true.",
    "Your heart is racing because it cares. That's not weakness.",
    "It's okay to do things afraid.",
    "You've survived every anxious moment so far. 100% success rate.",
    "The to-do list will still be there. Your peace comes first.",
    "Breathe. The next step will appear when you're ready.",
    "You don't have to outrun your anxiety. Just walk beside it.",
    "Small actions are anxiety's kryptonite.",
  ],
  thriving: [
    "You're glowing today and you don't even fully know it.",
    "Ride this wave gently — you've earned this feeling.",
    "This is what it feels like when your brain and heart are aligned.",
    "Whatever you do today, it'll have your full energy behind it.",
    "You're not just doing okay — you're actually doing it.",
    "This version of you? She's been here all along.",
    "Thriving doesn't mean perfect. You're proof of that.",
    "Let today be evidence of what you're capable of.",
    "Your good days belong to you. Enjoy every second.",
    "The focus you have right now is a gift. Use it softly.",
    "You're allowed to feel this good without waiting for it to end.",
    "Golden days deserve golden effort. You've got both.",
  ],
};

export const getRandomAffirmation = (category: string): string => {
  const pool = AFFIRMATIONS[category] ?? AFFIRMATIONS.neutral;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getAffirmationForFrequency = (frequency: Frequency): string => {
  return getRandomAffirmation(frequency.affirmationCategory);
};

export default AFFIRMATIONS;
