"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat, groupMessages } from "@/hooks/useChat";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

interface ChatShellProps {
  roomId: string;
  roomName?: string;
}

export default function ChatShell({ roomId, roomName }: ChatShellProps) {
  const { user } = useAuth();
  const { messages, sendMessage, isLoading, error, hasMore, loadMore } =
    useChat(roomId);
  const { typingUsers, setTyping, typingLabel } =
    useTypingIndicator(roomId);

  const grouped = useMemo(
    () => (user ? groupMessages(messages, user.uid) : []),
    [messages, user]
  );

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      <ChatHeader
        roomName={roomName ?? "Chat"}
        onBack={() => window.history.back()}
      />

      <MessageList
        groupedItems={grouped}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        error={error}
        myUid={user?.uid ?? ""}
      />

      <div style={{ flexShrink: 0 }}>
        <TypingIndicator typingLabel={typingLabel} typingUsers={typingUsers} />
        <MessageInput
          onSendMessage={sendMessage}
          onTypingChange={setTyping}
          disabled={!user}
        />
      </div>
    </div>
  );
}
