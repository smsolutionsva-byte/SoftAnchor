import { create } from "zustand";
import { persist } from "zustand/middleware";
import FREQUENCIES from "@/lib/frequencies";
import type {
  ThemeVariant,
  MoodType,
  NervousSystemState,
  Frequency,
  DailyIntention,
  Task,
  MicroStep,
  GentleToast,
  SanctuaryTab,
  OverwhelmSession,
  SoftSpaceId,
  SoftWin,
  StreakData,
  Badge,
  EveningSession,
  DailySummary,
} from "@/types";

interface AnchorStore {
  // ─── Firebase / Sync ───
  uid: string | null;
  setUid: (uid: string | null) => void;
  isSyncing: boolean;
  setIsSyncing: (val: boolean) => void;
  replaceWins: (wins: SoftWin[]) => void;
  replaceTasks: (tasks: Task[]) => void;
  restoreCheckIn: (checkIn: {
    nervousSystem: NervousSystemState;
    frequencyId: string;
    intention: string;
    completedAt: string;
    maxVisibleTasks: number;
  }) => void;

  // Theme
  activeTheme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;

  // Mood
  mood: MoodType | null;
  setMood: (mood: MoodType) => void;

  // Overwhelm (Stage 1 legacy)
  isOverwhelmed: boolean;
  setOverwhelmed: (val: boolean) => void;

  // Daily reset
  lastResetDate: string | null;
  setLastResetDate: (date: string) => void;

  // Nervous system
  nervousSystem: NervousSystemState;
  setNervousSystemState: (
    key: keyof NervousSystemState,
    value: string
  ) => void;

  // Frequency (computed from nervous system)
  currentFrequency: Frequency | null;
  setCurrentFrequency: (f: Frequency) => void;

  // Daily intention
  intention: DailyIntention | null;
  setIntention: (text: string) => void;

  // Check-in completion
  checkInCompletedAt: string | null;
  setCheckInCompleted: () => void;

  // Max tasks (driven by frequency)
  maxVisibleTasks: number;

  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  completeTask: (id: string) => void;
  skipTask: (id: string) => void;
  toggleTaskExpanded: (id: string) => void;

  // Steps
  completeStep: (taskId: string, stepId: string) => void;
  addTinySteps: (
    taskId: string,
    stepId: string,
    tinySteps: MicroStep[]
  ) => void;

  // UI state
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  isBreakdownLoading: boolean;
  setBreakdownLoading: (val: boolean) => void;
  showCelebration: boolean;
  setShowCelebration: (val: boolean) => void;
  lastCompletedTaskTitle: string;

  // Toasts
  toasts: GentleToast[];
  addToast: (toast: Omit<GentleToast, "id">) => void;
  removeToast: (id: string) => void;

  // ─── Stage 4: Sanctuary ───
  sanctuaryOpen: boolean;
  setSanctuaryOpen: (val: boolean) => void;
  activeSanctuaryTab: SanctuaryTab;
  setActiveSanctuaryTab: (tab: SanctuaryTab) => void;
  currentSession: OverwhelmSession | null;
  startSession: () => void;
  updateSession: (updates: Partial<OverwhelmSession>) => void;

  // Spiral detection
  overwhelmCount: number;
  incrementOverwhelmCount: () => void;
  spiralDetected: boolean;
  setSpiralDetected: (val: boolean) => void;
  lastOverwhelmAt: string | null;

  // Saved affirmations
  savedAffirmations: string[];
  saveAffirmation: (text: string) => void;
  removeSavedAffirmation: (text: string) => void;

  // Breathing history
  breathingSessionsToday: number;
  incrementBreathingSessions: () => void;

  // ─── Stage 5: Ambient Layer + Closing Rituals ───

  // Soft Spaces
  activeSoftSpace: SoftSpaceId;
  setActiveSoftSpace: (id: SoftSpaceId) => void;
  spaceAudioEnabled: boolean;
  setSpaceAudioEnabled: (val: boolean) => void;
  spaceAudioVolume: number;
  setSpaceAudioVolume: (v: number) => void;

  // Streaks & Soft Wins
  softWins: SoftWin[];
  addSoftWin: (type: SoftWin["type"], note?: string) => void;
  streakData: StreakData;
  unlockedBadges: Badge[];
  unlockBadge: (badge: Badge) => void;
  lastStreakCheck: string | null;
  setLastStreakCheck: (date: string) => void;

  // Evening
  eveningSessionToday: EveningSession | null;
  setEveningSession: (s: EveningSession) => void;
  updateEveningSession: (updates: Partial<EveningSession>) => void;
  eveningPromptDismissed: boolean;
  setEveningPromptDismissed: (val: boolean) => void;

  // Daily Summary archive
  summaryHistory: DailySummary[];
  saveDailySummary: (s: DailySummary) => void;

  // Cursor
  cursorVisible: boolean;
  setCursorVisible: (val: boolean) => void;

  // Reset
  resetDaily: () => void;
}

export const useAnchorStore = create<AnchorStore>()(
  persist(
    (set) => ({
      // ─── Firebase / Sync ───
      uid: null,
      setUid: (uid) => set({ uid }),
      isSyncing: false,
      setIsSyncing: (val) => set({ isSyncing: val }),
      replaceWins: (wins) => set({ softWins: wins }),
      replaceTasks: (tasks) => set({ tasks }),
      restoreCheckIn: (checkIn) => {
        const freq =
          FREQUENCIES.find((f) => f.id === checkIn.frequencyId) ?? null;
        set({
          nervousSystem: checkIn.nervousSystem,
          currentFrequency: freq,
          intention: { text: checkIn.intention, createdAt: checkIn.completedAt },
          maxVisibleTasks: checkIn.maxVisibleTasks,
          checkInCompletedAt: checkIn.completedAt,
          activeTheme: freq?.theme ?? "gentle-drift",
        });
      },

      activeTheme: "gentle-drift",
      setTheme: (theme) => set({ activeTheme: theme }),

      mood: null,
      setMood: (mood) => set({ mood }),

      isOverwhelmed: false,
      setOverwhelmed: (val) => set({ isOverwhelmed: val }),

      lastResetDate: null,
      setLastResetDate: (date) => set({ lastResetDate: date }),

      nervousSystem: { body: null, mind: null, heart: null },
      setNervousSystemState: (key, value) =>
        set((state) => ({
          nervousSystem: { ...state.nervousSystem, [key]: value },
        })),

      currentFrequency: null,
      setCurrentFrequency: (f) =>
        set({ currentFrequency: f, maxVisibleTasks: f.maxTasks }),

      intention: null,
      setIntention: (text) =>
        set({
          intention: { text, createdAt: new Date().toISOString() },
        }),

      checkInCompletedAt: null,
      setCheckInCompleted: () =>
        set({ checkInCompletedAt: new Date().toISOString() }),

      maxVisibleTasks: 2,

      // Tasks
      tasks: [],
      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "done" as const,
                  completedAt: new Date().toISOString(),
                }
              : t
          ),
          showCelebration: true,
          lastCompletedTaskTitle:
            state.tasks.find((t) => t.id === id)?.title ?? "",
        })),
      skipTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "skipped" as const } : t
          ),
        })),
      toggleTaskExpanded: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, isExpanded: !t.isExpanded } : t
          ),
        })),

      // Steps
      completeStep: (taskId, stepId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  steps: t.steps.map((s) =>
                    s.id === stepId
                      ? { ...s, status: "done" as const }
                      : s
                  ),
                }
              : t
          ),
        })),
      addTinySteps: (taskId, stepId, tinySteps) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  steps: t.steps.map((s) =>
                    s.id === stepId
                      ? { ...s, isTiny: true, tinyVersion: tinySteps }
                      : s
                  ),
                }
              : t
          ),
        })),

      // UI state
      activeTaskId: null,
      setActiveTaskId: (id) => set({ activeTaskId: id }),
      isBreakdownLoading: false,
      setBreakdownLoading: (val) => set({ isBreakdownLoading: val }),
      showCelebration: false,
      setShowCelebration: (val) => set({ showCelebration: val }),
      lastCompletedTaskTitle: "",

      // Toasts
      toasts: [],
      addToast: (toast) =>
        set((state) => {
          const newToasts = [
            ...state.toasts,
            { ...toast, id: crypto.randomUUID() },
          ];
          // Keep max 3 toasts visible — drop oldest
          return { toasts: newToasts.slice(-3) };
        }),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      // ─── Stage 4: Sanctuary ───
      sanctuaryOpen: false,
      setSanctuaryOpen: (val) => set({ sanctuaryOpen: val }),
      activeSanctuaryTab: "breathing",
      setActiveSanctuaryTab: (tab) => set({ activeSanctuaryTab: tab }),
      currentSession: null,
      startSession: () =>
        set((state) => ({
          currentSession: {
            openedAt: new Date().toISOString(),
            tabsVisited: ["breathing"],
            breathingCompleted: false,
            brainDumpUsed: false,
            tinyWinCompleted: false,
            affirmationSaved: false,
          },
          overwhelmCount: state.overwhelmCount + 1,
          lastOverwhelmAt: new Date().toISOString(),
        })),
      updateSession: (updates) =>
        set((state) => ({
          currentSession: state.currentSession
            ? { ...state.currentSession, ...updates }
            : null,
        })),

      // Spiral detection
      overwhelmCount: 0,
      incrementOverwhelmCount: () =>
        set((state) => ({ overwhelmCount: state.overwhelmCount + 1 })),
      spiralDetected: false,
      setSpiralDetected: (val) => set({ spiralDetected: val }),
      lastOverwhelmAt: null,

      // Saved affirmations
      savedAffirmations: [],
      saveAffirmation: (text) =>
        set((state) => ({
          savedAffirmations: state.savedAffirmations.includes(text)
            ? state.savedAffirmations
            : [...state.savedAffirmations, text],
        })),
      removeSavedAffirmation: (text) =>
        set((state) => ({
          savedAffirmations: state.savedAffirmations.filter((a) => a !== text),
        })),

      // Breathing history
      breathingSessionsToday: 0,
      incrementBreathingSessions: () =>
        set((state) => ({
          breathingSessionsToday: state.breathingSessionsToday + 1,
        })),

      // ─── Stage 5: Ambient Layer + Closing Rituals ───

      // Soft Spaces
      activeSoftSpace: "sakura" as SoftSpaceId,
      setActiveSoftSpace: (id) => set({ activeSoftSpace: id }),
      spaceAudioEnabled: false,
      setSpaceAudioEnabled: (val) => set({ spaceAudioEnabled: val }),
      spaceAudioVolume: 0.3,
      setSpaceAudioVolume: (v) => set({ spaceAudioVolume: v }),

      // Streaks & Soft Wins
      softWins: [],
      addSoftWin: (type, note) =>
        set((state) => ({
          softWins: [
            ...state.softWins,
            {
              id: crypto.randomUUID(),
              type,
              timestamp: new Date().toISOString(),
              note,
            },
          ],
        })),
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastWinDate: null,
        isSleeping: false,
        totalWins: 0,
        winsToday: 0,
        milestoneReached: null,
      },
      unlockedBadges: [],
      unlockBadge: (badge) =>
        set((state) => ({
          unlockedBadges: state.unlockedBadges.some((b) => b.id === badge.id)
            ? state.unlockedBadges
            : [...state.unlockedBadges, badge],
        })),
      lastStreakCheck: null,
      setLastStreakCheck: (date) => set({ lastStreakCheck: date }),

      // Evening
      eveningSessionToday: null,
      setEveningSession: (s) => set({ eveningSessionToday: s }),
      updateEveningSession: (updates) =>
        set((state) => ({
          eveningSessionToday: state.eveningSessionToday
            ? { ...state.eveningSessionToday, ...updates }
            : null,
        })),
      eveningPromptDismissed: false,
      setEveningPromptDismissed: (val) =>
        set({ eveningPromptDismissed: val }),

      // Daily Summary archive
      summaryHistory: [],
      saveDailySummary: (s) =>
        set((state) => ({
          summaryHistory: [...state.summaryHistory, s].slice(-7),
        })),

      // Cursor
      cursorVisible: true,
      setCursorVisible: (val) => set({ cursorVisible: val }),

      // Reset
      resetDaily: () =>
        set({
          nervousSystem: { body: null, mind: null, heart: null },
          currentFrequency: null,
          intention: null,
          checkInCompletedAt: null,
          overwhelmCount: 0,
          lastOverwhelmAt: null,
          breathingSessionsToday: 0,
          eveningSessionToday: null,
          eveningPromptDismissed: false,
        }),
    }),
    {
      name: "softanchor-v1",
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          isBreakdownLoading,
          showCelebration,
          toasts,
          activeTaskId,
          spiralDetected,
          sanctuaryOpen,
          currentSession,
          cursorVisible,
          eveningPromptDismissed,
          uid,
          isSyncing,
          ...rest
        } = state;
        return rest;
      },
    }
  )
);
