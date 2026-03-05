import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { paths } from "./schema";
import type { SoftSpaceId, ThemeVariant } from "@/types";

export interface UserSettings {
  activeSoftSpace: SoftSpaceId;
  activeTheme: ThemeVariant;
  spaceAudioEnabled: boolean;
  spaceAudioVolume: number;
  savedAffirmations: string[];
  unlockedBadgeIds: string[];
}

export async function syncSettingsToFirestore(
  uid: string,
  settings: Partial<UserSettings>
): Promise<void> {
  const ref = doc(db, paths.user(uid));
  await updateDoc(ref, settings as Record<string, unknown>);
}

export async function getSettingsFromFirestore(
  uid: string
): Promise<Partial<UserSettings>> {
  const ref = doc(db, paths.user(uid));
  const snap = await getDoc(ref);
  if (!snap.exists()) return {};
  const data = snap.data();
  return {
    activeSoftSpace: data.activeSoftSpace,
    activeTheme: data.activeTheme,
    spaceAudioEnabled: data.spaceAudioEnabled,
    spaceAudioVolume: data.spaceAudioVolume,
    savedAffirmations: data.savedAffirmations ?? [],
    unlockedBadgeIds: data.unlockedBadgeIds ?? [],
  };
}
