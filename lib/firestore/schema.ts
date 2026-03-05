/*
FIRESTORE STRUCTURE:

users/{uid}                          ← User profile document
  - uid: string
  - email: string
  - displayName: string
  - photoURL: string | null
  - createdAt: Timestamp
  - lastSeenAt: Timestamp
  - activeSoftSpace: SoftSpaceId
  - activeTheme: ThemeVariant
  - spaceAudioEnabled: boolean
  - spaceAudioVolume: number
  - savedAffirmations: string[]
  - longestStreak: number
  - totalSoftWins: number
  - unlockedBadgeIds: string[]

users/{uid}/tasks/{taskId}           ← Individual task documents
  - (all fields from Task type)
  - createdAt: Timestamp             ← Firestore Timestamp (not string)
  - completedAt: Timestamp | null

users/{uid}/checkIns/{date}          ← Daily check-in (doc ID = "YYYY-MM-DD")
  - date: string
  - nervousSystem: NervousSystemState
  - frequencyId: string
  - intention: string | null
  - completedAt: Timestamp

users/{uid}/softWins/{winId}         ← Soft win log entries
  - id: string
  - type: SoftWin["type"]
  - timestamp: Timestamp
  - note?: string

users/{uid}/eveningSessions/{date}   ← Evening session (doc ID = "YYYY-MM-DD")
  - date: string
  - reflectionText: string
  - tomorrowTask: string | null
  - completedAt: Timestamp | null
  - skipped: boolean

users/{uid}/dailySummaries/{date}    ← Daily summary (doc ID = "YYYY-MM-DD")
  - (all fields from DailySummary type)
  - date: string (same as doc ID)
*/

export const COLLECTIONS = {
  USERS: "users",
  TASKS: "tasks",
  CHECK_INS: "checkIns",
  SOFT_WINS: "softWins",
  EVENING_SESSIONS: "eveningSessions",
  SUMMARIES: "dailySummaries",
} as const;

// Document path helpers
export const paths = {
  user: (uid: string) => `${COLLECTIONS.USERS}/${uid}`,

  userTasks: (uid: string) =>
    `${COLLECTIONS.USERS}/${uid}/${COLLECTIONS.TASKS}`,

  userTask: (uid: string, taskId: string) =>
    `${COLLECTIONS.USERS}/${uid}/${COLLECTIONS.TASKS}/${taskId}`,

  userCheckIns: (uid: string) =>
    `${COLLECTIONS.USERS}/${uid}/${COLLECTIONS.CHECK_INS}`,

  userCheckIn: (uid: string, date: string) =>
    `${COLLECTIONS.USERS}/${uid}/${COLLECTIONS.CHECK_INS}/${date}`,

  userSoftWins: (uid: string) =>
    `${COLLECTIONS.USERS}/${uid}/${COLLECTIONS.SOFT_WINS}`,

  userEveningSessions: (uid: string) =>
    `${COLLECTIONS.USERS}/${uid}/${COLLECTIONS.EVENING_SESSIONS}`,

  userEveningSession: (uid: string, date: string) =>
    `${COLLECTIONS.USERS}/${uid}/${COLLECTIONS.EVENING_SESSIONS}/${date}`,

  userSummaries: (uid: string) =>
    `${COLLECTIONS.USERS}/${uid}/${COLLECTIONS.SUMMARIES}`,
};

// Date key format used as Firestore document IDs for daily docs
export function todayKey(): string {
  return new Date().toISOString().split("T")[0]; // "2025-01-15"
}
