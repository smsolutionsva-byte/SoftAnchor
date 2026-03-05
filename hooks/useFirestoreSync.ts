"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import { useAuth } from "@/context/AuthContext";

import { subscribeToTodayTasks, addTaskToFirestore, updateTaskInFirestore, deleteTaskFromFirestore } from "@/lib/firestore/taskService";
import { subscribeToSoftWins, addSoftWinToFirestore } from "@/lib/firestore/streakService";
import { saveTodayCheckIn, getTodayCheckIn } from "@/lib/firestore/checkInService";
import { saveEveningSession, updateEveningSessionInFirestore, getTodayEveningSession } from "@/lib/firestore/eveningService";
import { syncSettingsToFirestore } from "@/lib/firestore/settingsService";

import type { Task, SoftWin } from "@/types";

/**
 * Master hook: two-way Zustand ↔ Firestore sync.
 * Call once at the top of MainDashboard.
 */
export function useFirestoreSync() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const setIsSyncing = useAnchorStore((s) => s.setIsSyncing);
  const replaceTasks = useAnchorStore((s) => s.replaceTasks);
  const replaceWins = useAnchorStore((s) => s.replaceWins);
  const restoreCheckIn = useAnchorStore((s) => s.restoreCheckIn);

  // Track previous values to detect local writes
  const prevTasksRef = useRef<Task[]>([]);
  const prevWinsRef = useRef<SoftWin[]>([]);
  const settingsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRemoteUpdate = useRef(false);

  // ─── Restore today's check-in from Firestore on mount ───
  useEffect(() => {
    if (!uid) return;
    (async () => {
      try {
        const checkIn = await getTodayCheckIn(uid);
        if (checkIn) {
          // completedAt may be a Firestore Timestamp or string
          const completedAt =
            typeof checkIn.completedAt === "object" &&
            checkIn.completedAt !== null &&
            "toDate" in (checkIn.completedAt as object)
              ? (checkIn.completedAt as { toDate: () => Date }).toDate().toISOString()
              : String(checkIn.completedAt ?? new Date().toISOString());

          restoreCheckIn({
            nervousSystem: checkIn.nervousSystem,
            frequencyId: checkIn.frequencyId,
            intention: checkIn.intention ?? "",
            completedAt,
            maxVisibleTasks: checkIn.maxVisibleTasks,
          });
        }
      } catch (err) {
        console.error("SoftAnchor: restore check-in failed", err);
      }
    })();
  }, [uid, restoreCheckIn]);

  // ─── Restore today's evening session on mount ───
  useEffect(() => {
    if (!uid) return;
    (async () => {
      try {
        const session = await getTodayEveningSession(uid);
        if (session) {
          useAnchorStore.getState().setEveningSession(session);
        }
      } catch (err) {
        console.error("SoftAnchor: restore evening session failed", err);
      }
    })();
  }, [uid]);

  // ─── Real-time tasks listener ───
  useEffect(() => {
    if (!uid) return;
    setIsSyncing(true);
    const unsub = subscribeToTodayTasks(uid, (remoteTasks) => {
      isRemoteUpdate.current = true;
      replaceTasks(remoteTasks);
      prevTasksRef.current = remoteTasks;
      setIsSyncing(false);
      // Allow local writes after microtask
      queueMicrotask(() => {
        isRemoteUpdate.current = false;
      });
    });
    return unsub;
  }, [uid, replaceTasks, setIsSyncing]);

  // ─── Real-time soft wins listener ───
  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeToSoftWins(uid, (remoteWins) => {
      isRemoteUpdate.current = true;
      replaceWins(remoteWins);
      prevWinsRef.current = remoteWins;
      queueMicrotask(() => {
        isRemoteUpdate.current = false;
      });
    });
    return unsub;
  }, [uid, replaceWins]);

  // ─── Zustand subscribe: write local task changes → Firestore ───
  useEffect(() => {
    if (!uid) return;
    const unsub = useAnchorStore.subscribe((state) => {
      if (isRemoteUpdate.current) return;

      const prevTasks = prevTasksRef.current;
      const currTasks = state.tasks;

      // Detect adds
      for (const t of currTasks) {
        if (!prevTasks.find((p) => p.id === t.id)) {
          addTaskToFirestore(uid, t).catch(console.error);
        }
      }
      // Detect updates (any changed tasks by reference)
      for (const t of currTasks) {
        const prev = prevTasks.find((p) => p.id === t.id);
        if (prev && prev !== t) {
          updateTaskInFirestore(uid, t.id, t).catch(console.error);
        }
      }
      // Detect removes
      for (const p of prevTasks) {
        if (!currTasks.find((t) => t.id === p.id)) {
          deleteTaskFromFirestore(uid, p.id).catch(console.error);
        }
      }

      prevTasksRef.current = currTasks;
    });
    return unsub;
  }, [uid]);

  // ─── Zustand subscribe: write local win changes → Firestore ───
  useEffect(() => {
    if (!uid) return;
    const unsub = useAnchorStore.subscribe((state) => {
      if (isRemoteUpdate.current) return;

      const prevWins = prevWinsRef.current;
      const currWins = state.softWins;

      // Only handle adds (wins are immutable)
      for (const w of currWins) {
        if (!prevWins.find((p) => p.id === w.id)) {
          addSoftWinToFirestore(uid, w).catch(console.error);
        }
      }

      prevWinsRef.current = currWins;
    });
    return unsub;
  }, [uid]);

  // ─── Write check-in to Firestore (imperative helper) ───
  const syncCheckIn = useCallback(async () => {
    if (!uid) return;
    const s = useAnchorStore.getState();
    if (!s.checkInCompletedAt || !s.currentFrequency) return;

    await saveTodayCheckIn(uid, {
      nervousSystem: s.nervousSystem,
      frequencyId: s.currentFrequency.id,
      frequencyName: s.currentFrequency.name,
      intention: s.intention?.text ?? "",
      maxVisibleTasks: s.maxVisibleTasks,
    });
  }, [uid]);

  // Auto-sync check-in when it completes
  useEffect(() => {
    if (!uid) return;
    let prevCompletedAt = useAnchorStore.getState().checkInCompletedAt;
    const unsub = useAnchorStore.subscribe((state) => {
      if (state.checkInCompletedAt && state.checkInCompletedAt !== prevCompletedAt) {
        prevCompletedAt = state.checkInCompletedAt;
        syncCheckIn();
      }
    });
    return unsub;
  }, [uid, syncCheckIn]);

  // ─── Debounced settings sync ───
  useEffect(() => {
    if (!uid) return;
    const unsub = useAnchorStore.subscribe((state) => {
      if (isRemoteUpdate.current) return;

      if (settingsTimerRef.current) clearTimeout(settingsTimerRef.current);
      settingsTimerRef.current = setTimeout(() => {
        syncSettingsToFirestore(uid, {
          activeTheme: state.activeTheme,
          activeSoftSpace: state.activeSoftSpace,
          spaceAudioEnabled: state.spaceAudioEnabled,
          spaceAudioVolume: state.spaceAudioVolume,
          savedAffirmations: state.savedAffirmations,
        }).catch(console.error);
      }, 2000);
    });
    return () => {
      unsub();
      if (settingsTimerRef.current) clearTimeout(settingsTimerRef.current);
    };
  }, [uid]);

  // ─── Evening session sync ───
  useEffect(() => {
    if (!uid) return;
    let prevSession = useAnchorStore.getState().eveningSessionToday;

    const unsub = useAnchorStore.subscribe((state) => {
      if (isRemoteUpdate.current) return;

      const curr = state.eveningSessionToday;
      if (curr && curr !== prevSession) {
        if (!prevSession) {
          // New session started
          saveEveningSession(uid, curr).catch(console.error);
        } else {
          // Session updated
          updateEveningSessionInFirestore(uid, curr).catch(console.error);
        }
        prevSession = curr;
      }
    });
    return unsub;
  }, [uid]);
}
