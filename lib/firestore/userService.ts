import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type DocumentSnapshot,
} from "firebase/firestore";
import { type User } from "firebase/auth";
import { db } from "../firebase";
import { paths } from "./schema";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: unknown; // Firestore Timestamp
  lastSeenAt: unknown; // Firestore Timestamp
  activeSoftSpace: string;
  activeTheme: string;
  spaceAudioEnabled: boolean;
  spaceAudioVolume: number;
  savedAffirmations: string[];
  longestStreak: number;
  totalSoftWins: number;
  unlockedBadgeIds: string[];
}

// Called on every sign-in — creates profile if new, updates lastSeen if existing
export async function upsertUserProfile(user: User): Promise<UserProfile> {
  const ref = doc(db, paths.user(user.uid));
  const snap: DocumentSnapshot = await getDoc(ref);

  if (!snap.exists()) {
    // First time — create full profile
    const newProfile = {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? "soft one",
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
      activeSoftSpace: "sakura",
      activeTheme: "gentle-drift",
      spaceAudioEnabled: false,
      spaceAudioVolume: 0.3,
      savedAffirmations: [] as string[],
      longestStreak: 0,
      totalSoftWins: 0,
      unlockedBadgeIds: [] as string[],
    };
    await setDoc(ref, newProfile);
    return { ...newProfile } as UserProfile;
  }

  // Returning user — update lastSeenAt
  await updateDoc(ref, { lastSeenAt: serverTimestamp() });
  return snap.data() as UserProfile;
}

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const ref = doc(db, paths.user(uid));
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserSettings(
  uid: string,
  updates: Partial<
    Pick<
      UserProfile,
      | "activeSoftSpace"
      | "activeTheme"
      | "spaceAudioEnabled"
      | "spaceAudioVolume"
      | "savedAffirmations"
      | "longestStreak"
      | "totalSoftWins"
      | "unlockedBadgeIds"
    >
  >
): Promise<void> {
  const ref = doc(db, paths.user(uid));
  await updateDoc(ref, { ...updates, lastSeenAt: serverTimestamp() });
}
