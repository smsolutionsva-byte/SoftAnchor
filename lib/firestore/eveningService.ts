import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { paths, todayKey } from "./schema";
import type { EveningSession } from "@/types";

export async function saveEveningSession(
  uid: string,
  session: EveningSession
): Promise<void> {
  const today = todayKey();
  const ref = doc(db, paths.userEveningSession(uid, today));
  await setDoc(ref, {
    ...session,
    date: today,
    startedAt: serverTimestamp(),
    completedAt: session.completedAt ? serverTimestamp() : null,
  });
}

export async function updateEveningSessionInFirestore(
  uid: string,
  updates: Partial<EveningSession>
): Promise<void> {
  const today = todayKey();
  const ref = doc(db, paths.userEveningSession(uid, today));
  const firestoreUpdates: Record<string, unknown> = { ...updates };
  if (updates.completedAt) {
    firestoreUpdates.completedAt = serverTimestamp();
  }
  await updateDoc(ref, firestoreUpdates);
}

export async function getTodayEveningSession(
  uid: string
): Promise<EveningSession | null> {
  const today = todayKey();
  const ref = doc(db, paths.userEveningSession(uid, today));
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    startedAt:
      data.startedAt instanceof Timestamp
        ? data.startedAt.toDate().toISOString()
        : data.startedAt,
    completedAt:
      data.completedAt instanceof Timestamp
        ? data.completedAt.toDate().toISOString()
        : data.completedAt,
  } as EveningSession;
}
