"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  ref,
  set,
  remove,
  onValue,
  off,
  type DataSnapshot,
} from "firebase/database";
import { rtdb } from "@/lib/rtdb";
import { useAuth } from "@/context/AuthContext";
import type { ITypingUser, UseTypingReturn } from "@/types/chat";

const TYPING_EXPIRY_MS = 5000; // clear stale "typing" after 5s

export function useTypingIndicator(roomId: string): UseTypingReturn {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<ITypingUser[]>([]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // ── Listen to typing state of ALL users in room ─────────────────────────────
  useEffect(() => {
    if (!roomId || !user) return;

    const typingRef = ref(rtdb, `typing/${roomId}`);

    const handleSnapshot = (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) {
        setTypingUsers([]);
        return;
      }

      const raw = snapshot.val() as Record<string, ITypingUser>;
      const now = Date.now();

      // Filter out: current user, and stale entries (> 5s old)
      const active = Object.values(raw).filter(
        (t) => t.uid !== user.uid && now - t.startedAt < TYPING_EXPIRY_MS
      );
      setTypingUsers(active);
    };

    onValue(typingRef, handleSnapshot);
    return () => off(typingRef, "value", handleSnapshot);
  }, [roomId, user]);

  // ── Set own typing state ────────────────────────────────────────────────────
  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!user || !roomId) return;

      const myTypingRef = ref(rtdb, `typing/${roomId}/${user.uid}`);

      if (isTyping && !isTypingRef.current) {
        // Set typing = true
        isTypingRef.current = true;
        set(myTypingRef, {
          uid: user.uid,
          displayName: user.displayName ?? "Someone",
          startedAt: Date.now(),
        }).catch(console.error);
      }

      // Always reset the auto-clear timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        // Auto-clear after TYPING_EXPIRY_MS of no keystrokes
        isTypingRef.current = false;
        remove(myTypingRef).catch(console.error);
      }, TYPING_EXPIRY_MS);

      if (!isTyping) {
        // Explicit stop (e.g., message sent, input blurred)
        isTypingRef.current = false;
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        remove(myTypingRef).catch(console.error);
      }
    },
    [user, roomId]
  );

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (!user || !roomId) return;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      const myTypingRef = ref(rtdb, `typing/${roomId}/${user.uid}`);
      remove(myTypingRef).catch(console.error);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, roomId]);

  // ── Human-readable typing label ─────────────────────────────────────────────
  const typingLabel = useMemo(() => {
    if (typingUsers.length === 0) return "";
    if (typingUsers.length === 1) {
      return `${typingUsers[0].displayName} is typing...`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0].displayName} and ${typingUsers[1].displayName} are typing...`;
    }
    return `${typingUsers.length} people are typing...`;
  }, [typingUsers]);

  return { typingUsers, setTyping, typingLabel };
}
