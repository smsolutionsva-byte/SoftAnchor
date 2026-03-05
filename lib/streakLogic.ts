import type { SoftWin, StreakData } from "@/types";

export function calculateStreak(wins: SoftWin[]): StreakData {
  if (wins.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastWinDate: null,
      isSleeping: false,
      totalWins: 0,
      winsToday: 0,
      milestoneReached: null,
    };
  }

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const winDates = [
    ...new Set(wins.map((w) => new Date(w.timestamp).toDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const winsToday = wins.filter(
    (w) => new Date(w.timestamp).toDateString() === today
  ).length;

  let currentStreak = 0;
  const checkDate = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toDateString();
    if (winDates.includes(dateStr)) {
      currentStreak++;
      checkDate.setTime(checkDate.getTime() - 86400000);
    } else if (i === 0) {
      // Today has no wins yet — check if yesterday did (sleeping streak)
      checkDate.setTime(checkDate.getTime() - 86400000);
      continue;
    } else {
      break;
    }
  }

  const isSleeping = winsToday === 0 && winDates.includes(yesterday);

  let longestStreak = currentStreak;
  let tempStreak = 0;
  for (let i = 0; i < winDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
      continue;
    }
    const prev = new Date(winDates[i - 1]);
    const curr = new Date(winDates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  const MILESTONES = [3, 7, 14, 21, 30, 50, 100];
  const milestoneReached = MILESTONES.find((m) => currentStreak === m) ?? null;

  return {
    currentStreak,
    longestStreak,
    lastWinDate: winDates[0] ?? null,
    isSleeping,
    totalWins: wins.length,
    winsToday,
    milestoneReached,
  };
}

export function getStreakMessage(data: StreakData): string {
  if (data.currentStreak === 0 && !data.isSleeping) {
    return "every journey starts with today 🌱";
  }
  if (data.isSleeping) {
    return "your anchor was resting 🌙 — it's still here";
  }
  if (data.currentStreak === 1) {
    return "day one. that's already something 💛";
  }
  if (data.currentStreak < 7) {
    return `${data.currentStreak} days of showing up 🌸`;
  }
  if (data.currentStreak < 14) {
    return "a whole week and then some ✨";
  }
  if (data.currentStreak < 30) {
    return `${data.currentStreak} days. you're building something real 💜`;
  }
  return `${data.currentStreak} days. this is who you are now 🌟`;
}

export function getWinsMessage(winsToday: number): string {
  if (winsToday === 0) return "no wins logged yet today";
  if (winsToday === 1) return "one soft win today 💛";
  if (winsToday <= 3) return `${winsToday} soft wins today 🌸`;
  if (winsToday <= 6) return `${winsToday} wins — you're glowing ✨`;
  return `${winsToday} wins today. extraordinary 💜`;
}
