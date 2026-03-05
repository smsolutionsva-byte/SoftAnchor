import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { paths, todayKey } from "./schema";
import type { Task } from "@/types";

/**
 * Recursively strip `undefined` values from any object/array.
 * Firestore rejects documents containing `undefined` fields.
 */
function stripUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(stripUndefined) as T;
  if (typeof obj === "object" && obj !== null) {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value !== undefined) {
        cleaned[key] = stripUndefined(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

// Convert Firestore Timestamps to ISO strings for Zustand compatibility
function taskFromFirestore(data: Record<string, unknown>, id: string): Task {
  return {
    ...data,
    id,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : (data.createdAt as string),
    completedAt:
      data.completedAt instanceof Timestamp
        ? data.completedAt.toDate().toISOString()
        : (data.completedAt as string | null),
  } as Task;
}

// Real-time listener for today's tasks
export function subscribeToTodayTasks(
  uid: string,
  onUpdate: (tasks: Task[]) => void
): Unsubscribe {
  const today = todayKey();
  const startOfDay = new Date(today + "T00:00:00.000Z");

  const q = query(
    collection(db, paths.userTasks(uid)),
    where("createdAt", ">=", Timestamp.fromDate(startOfDay)),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((d) =>
        taskFromFirestore(d.data() as Record<string, unknown>, d.id)
      );
      onUpdate(tasks);
    },
    (error) => {
      console.error("SoftAnchor: Task listener error", error);
    }
  );
}

export async function addTaskToFirestore(
  uid: string,
  task: Task
): Promise<void> {
  const ref = doc(db, paths.userTask(uid, task.id));
  const { createdAt, completedAt, ...rest } = task;
  const data = stripUndefined({
    ...rest,
    createdAt: createdAt ? Timestamp.fromDate(new Date(createdAt)) : serverTimestamp(),
    completedAt: completedAt
      ? Timestamp.fromDate(new Date(completedAt))
      : null,
  });
  await setDoc(ref, data);
}

export async function updateTaskInFirestore(
  uid: string,
  taskId: string,
  updates: Partial<Task>
): Promise<void> {
  const ref = doc(db, paths.userTask(uid, taskId));
  const firestoreUpdates: Record<string, unknown> = { ...updates };

  if (updates.completedAt) {
    firestoreUpdates.completedAt = Timestamp.fromDate(
      new Date(updates.completedAt)
    );
  }

  await updateDoc(ref, stripUndefined(firestoreUpdates));
}

export async function deleteTaskFromFirestore(
  uid: string,
  taskId: string
): Promise<void> {
  const ref = doc(db, paths.userTask(uid, taskId));
  await deleteDoc(ref);
}

// Batch delete all tasks (for daily reset)
export async function deleteAllUserTasksToday(uid: string): Promise<void> {
  const today = todayKey();
  const startOfDay = new Date(today + "T00:00:00.000Z");

  const q = query(
    collection(db, paths.userTasks(uid)),
    where("createdAt", ">=", Timestamp.fromDate(startOfDay))
  );

  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}
