"use client";

/*
RTDB STRUCTURE:

/messages/{roomId}/{pushKey}
  - id: string (same as pushKey)
  - roomId: string
  - senderId: string
  - senderName: string
  - senderPhotoURL: string | null
  - text: string
  - createdAt: number
  - editedAt: number | null
  - status: "sent"

/typing/{roomId}/{uid}
  - uid: string
  - displayName: string
  - startedAt: number
  (set to null on stop typing — Firebase remove())

/rooms/{roomId}
  - id: string
  - name: string
  - description: string
  - createdAt: number
  - lastMessage: { text, senderName, createdAt } | null
  - memberCount: number
*/

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ref,
  push,
  onValue,
  off,
  query,
  orderByChild,
  limitToLast,
  update,
  type DatabaseReference,
  type DataSnapshot,
} from "firebase/database";
import { rtdb } from "@/lib/rtdb";
import { useAuth } from "@/context/AuthContext";
import type {
  IMessage,
  UseChatReturn,
  ChatListItem,
  IMessageGroup,
} from "@/types/chat";

const PAGE_SIZE = 50;

export function useChat(roomId: string): UseChatReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  // ── Real-time listener ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId || !user) return;

    setIsLoading(true);
    setError(null);

    const messagesRef = query(
      ref(rtdb, `messages/${roomId}`),
      orderByChild("createdAt"),
      limitToLast(limit)
    );

    const unsubscribe = onValue(
      messagesRef,
      (snapshot: DataSnapshot) => {
        if (!snapshot.exists()) {
          setMessages([]);
          setIsLoading(false);
          return;
        }

        const raw = snapshot.val() as Record<string, Omit<IMessage, "id">>;
        const parsed: IMessage[] = Object.entries(raw)
          .map(([key, val]) => ({ ...val, id: key }))
          .sort((a, b) => a.createdAt - b.createdAt);

        setMessages(parsed);
        setIsLoading(false);
      },
      (err) => {
        console.error("RTDB chat error:", err);
        setError("Couldn't load messages right now 💛");
        setIsLoading(false);
      }
    );

    // Cleanup: detach listener
    return () => off(messagesRef as DatabaseReference, "value", unsubscribe);
  }, [roomId, user, limit]);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      if (!user || !text.trim()) return;

      const trimmed = text.trim().slice(0, 2000);
      const messagesRef = ref(rtdb, `messages/${roomId}`);
      const roomRef = ref(rtdb, `rooms/${roomId}`);

      const newMessage: Omit<IMessage, "id"> = {
        roomId,
        senderId: user.uid,
        senderName: user.displayName ?? "Anonymous",
        senderPhotoURL: user.photoURL ?? null,
        text: trimmed,
        createdAt: Date.now(),
        editedAt: null,
        status: "sent",
      };

      try {
        // Push to messages
        const newRef = push(messagesRef);
        await update(newRef, { ...newMessage, id: newRef.key });

        // Update room's lastMessage for room list previews
        await update(roomRef, {
          lastMessage: {
            text:
              trimmed.length > 60
                ? trimmed.slice(0, 60) + "..."
                : trimmed,
            senderName: user.displayName ?? "Anonymous",
            createdAt: Date.now(),
          },
        });
      } catch (err) {
        console.error("Send message error:", err);
        setError("Message didn't send. Want to try again? 💛");
        throw err;
      }
    },
    [user, roomId]
  );

  // ── Load more (pagination) ──────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    setLimit((prev) => prev + PAGE_SIZE);
  }, []);

  // ── Has more to load ────────────────────────────────────────────────────────
  const hasMore = messages.length >= limit;

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    hasMore,
    loadMore,
    messageCount: messages.length,
  };
}

// ── Utility: group messages for display ────────────────────────────────────────

export function groupMessages(
  messages: IMessage[],
  myUid: string
): ChatListItem[] {
  if (messages.length === 0) return [];

  const result: ChatListItem[] = [];
  let currentGroup: IMessageGroup | null = null;
  let lastDateLabel = "";

  messages.forEach((msg) => {
    // Date separator logic
    const dateLabel = getDateLabel(msg.createdAt);
    if (dateLabel !== lastDateLabel) {
      lastDateLabel = dateLabel;
      result.push({
        type: "date-separator",
        label: dateLabel,
        timestamp: msg.createdAt,
      });
      currentGroup = null; // force new group after date separator
    }

    const isMine = msg.senderId === myUid;
    const GROUPING_THRESHOLD_MS = 3 * 60 * 1000; // 3 minutes

    // Start new group if: different sender, or gap > threshold
    const shouldStartNewGroup =
      !currentGroup ||
      currentGroup.senderId !== msg.senderId ||
      msg.createdAt -
        currentGroup.messages[currentGroup.messages.length - 1].createdAt >
        GROUPING_THRESHOLD_MS;

    if (shouldStartNewGroup) {
      currentGroup = {
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderPhotoURL: msg.senderPhotoURL,
        messages: [msg],
        isSentByMe: isMine,
        firstCreatedAt: msg.createdAt,
      };
      result.push(currentGroup);
    } else {
      currentGroup!.messages.push(msg);
    }
  });

  return result;
}

function getDateLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
