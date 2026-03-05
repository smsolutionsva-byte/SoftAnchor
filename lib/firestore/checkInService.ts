import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { paths, todayKey } from "./schema";
import type { NervousSystemState } from "@/types";

export interface CheckInDocument {
  date: string;
  nervousSystem: NervousSystemState;
  frequencyId: string;
  frequencyName: string;
  intention: string | null;
  completedAt: unknown; // Timestamp
  maxVisibleTasks: number;
}

export async function saveTodayCheckIn(
  uid: string,
  data: Omit<CheckInDocument, "date" | "completedAt">
): Promise<void> {
  const today = todayKey();
  const ref = doc(db, paths.userCheckIn(uid, today));
  await setDoc(ref, {
    ...data,
    date: today,
    completedAt: serverTimestamp(),
  });
}

export async function getTodayCheckIn(
  uid: string
): Promise<CheckInDocument | null> {
  const today = todayKey();
  const ref = doc(db, paths.userCheckIn(uid, today));
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as CheckInDocument) : null;
}
