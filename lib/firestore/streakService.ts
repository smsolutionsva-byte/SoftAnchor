import {
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { paths } from "./schema";
import type { SoftWin } from "@/types";

// Convert Firestore doc to SoftWin
function winFromFirestore(
  data: Record<string, unknown>,
  id: string
): SoftWin {
  return {
    id,
    type: data.type as SoftWin["type"],
    timestamp:
      data.timestamp instanceof Timestamp
        ? data.timestamp.toDate().toISOString()
        : (data.timestamp as string),
    note: data.note as string | undefined,
  };
}

// Real-time listener for last 200 soft wins
export function subscribeToSoftWins(
  uid: string,
  onUpdate: (wins: SoftWin[]) => void
): Unsubscribe {
  const q = query(
    collection(db, paths.userSoftWins(uid)),
    orderBy("timestamp", "desc"),
    limit(200)
  );

  return onSnapshot(q, (snapshot) => {
    const wins = snapshot.docs.map((d) =>
      winFromFirestore(d.data() as Record<string, unknown>, d.id)
    );
    onUpdate(wins);
  });
}

export async function addSoftWinToFirestore(
  uid: string,
  win: SoftWin
): Promise<void> {
  const ref = doc(db, `${paths.userSoftWins(uid)}/${win.id}`);
  // Firestore rejects `undefined` values — strip them
  const data: Record<string, unknown> = {
    id: win.id,
    type: win.type,
    timestamp: serverTimestamp(),
  };
  if (win.note !== undefined) data.note = win.note;
  await setDoc(ref, data);
}
