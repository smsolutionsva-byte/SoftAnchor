export type MoodType = "soft-static" | "gentle-drift" | "golden-hour";

export type ThemeVariant = "soft-static" | "gentle-drift" | "golden-hour";

export interface Theme {
  id: ThemeVariant;
  label: string;
  emoji: string;
  moodLabel: string;
  description: string;
  vars: Record<string, string>;
}

export interface ButtonVariant {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export interface OrbConfig {
  size: number;
  color: string;
  x: number[];
  y: number[];
  duration: number;
  opacity: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

// ─── Stage 2: Nervous System Check-In ───

export type BodyState = "tense" | "neutral" | "relaxed";
export type MindState = "foggy" | "wandering" | "focused";
export type HeartState = "heavy" | "okay" | "light";

export interface NervousSystemState {
  body: BodyState | null;
  mind: MindState | null;
  heart: HeartState | null;
}

export interface Frequency {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  theme: ThemeVariant;
  maxTasks: number;
  affirmationCategory: string;
  welcomeMessage: string;
  color: string;
}

export interface DailyIntention {
  text: string;
  createdAt: string;
}

export interface CheckInData {
  nervousSystem: NervousSystemState;
  frequency: Frequency | null;
  intention: DailyIntention | null;
  completedAt: string | null;
}

// ─── Stage 3: Tasks & Productivity ───

export type TaskStatus = "pending" | "in-progress" | "done" | "skipped";

export type StepStatus = "pending" | "done";

export interface MicroStep {
  id: string;
  text: string;
  status: StepStatus;
  tinyVersion?: MicroStep[];
  isTiny: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  originalInput: string;
  title: string;
  steps: MicroStep[];
  status: TaskStatus;
  emotionalWeight: "light" | "medium" | "heavy";
  estimatedMinutes: number;
  isExpanded: boolean;
  createdAt: string;
  completedAt: string | null;
  encouragement: string;
}

export interface BreakdownResponse {
  title: string;
  emotionalWeight: "light" | "medium" | "heavy";
  estimatedMinutes: number;
  encouragement: string;
  steps: {
    text: string;
    tinyVersion?: string[];
  }[];
}

export interface GentleToast {
  id: string;
  message: string;
  type: "success" | "info" | "soft-error";
  emoji: string;
}

// ─── Stage 4: Overwhelm Sanctuary ───

export type SanctuaryTab =
  "breathing" | "braindump" | "tinywin" | "kindness";

export type BreathingPhase =
  "idle" | "inhale" | "hold-in" | "exhale" | "hold-out" | "complete";

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cycles: number;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
}

export interface TinyWin {
  id: string;
  text: string;
  category: "body" | "social" | "environment" | "self";
  emoji: string;
}

export interface OverwhelmSession {
  openedAt: string;
  tabsVisited: SanctuaryTab[];
  breathingCompleted: boolean;
  brainDumpUsed: boolean;
  tinyWinCompleted: boolean;
  affirmationSaved: boolean;
}

export interface SpiralEvent {
  type: "rapid-add" | "mass-delete" | "repeated-overwhelm" | "long-idle";
  detectedAt: string;
  count: number;
}

// ─── Stage 5: Ambient Layer + Closing Rituals ───

export type SoftSpaceId = "sakura" | "candlelit" | "ocean" | "greenhouse";

export interface SoftSpace {
  id: SoftSpaceId;
  name: string;
  emoji: string;
  tagline: string;
  themeOverride: Partial<Record<string, string>>;
  overlayType: "petals" | "flicker" | "waves" | "particles";
  audioSrc: string | null;
  audioLabel: string;
  cursorColor: string;
  backgroundGradient: string;
}

export interface SoftWin {
  id: string;
  type:
    | "task-complete"
    | "step-complete"
    | "checkin"
    | "breathing"
    | "brain-dump"
    | "tiny-win"
    | "app-open";
  timestamp: string;
  note?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWinDate: string | null;
  isSleeping: boolean;
  totalWins: number;
  winsToday: number;
  milestoneReached: number | null;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requiredWins: number;
  unlockedAt: string | null;
  message: string;
}

export interface EveningSession {
  startedAt: string;
  reflectionText: string;
  tomorrowTask: string | null;
  completedAt: string | null;
  skipped: boolean;
}

export interface DailySummary {
  date: string;
  tasksCompleted: number;
  stepsCompleted: number;
  breathingSessions: number;
  overwhelmOpened: number;
  softWinsTotal: number;
  frequencyId: string | null;
  intention: string | null;
}
