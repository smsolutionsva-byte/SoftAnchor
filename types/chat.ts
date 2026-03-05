// ── Core message shape stored in RTDB ─────────────────────────────────────────

export interface IMessage {
  id: string;                    // RTDB push key (populated client-side)
  roomId: string;                // which chat room this belongs to
  senderId: string;              // Firebase Auth uid
  senderName: string;            // displayName at time of send
  senderPhotoURL: string | null; // photoURL at time of send
  text: string;                  // message content (max 2000 chars)
  createdAt: number;             // Unix timestamp ms (Date.now())
  editedAt: number | null;       // null if never edited
  status: MessageStatus;
}

export type MessageStatus = "sending" | "sent" | "failed";

// ── Typing presence shape stored in RTDB ──────────────────────────────────────

export interface ITypingUser {
  uid: string;
  displayName: string;
  startedAt: number;             // Unix ms — used to auto-expire stale typing
}

// RTDB shape: /typing/{roomId}/{uid} = ITypingUser | null

// ── Room metadata ─────────────────────────────────────────────────────────────

export interface IChatRoom {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  lastMessage: ILastMessage | null;
  memberCount: number;
}

export interface ILastMessage {
  text: string;
  senderName: string;
  createdAt: number;
}

// ── useChat hook return type ───────────────────────────────────────────────────

export interface UseChatReturn {
  messages: IMessage[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  messageCount: number;
}

// ── useTypingIndicator hook return type ───────────────────────────────────────

export interface UseTypingReturn {
  typingUsers: ITypingUser[];
  setTyping: (isTyping: boolean) => void;
  typingLabel: string;           // e.g. "Sarah is typing..." or "2 people are typing..."
}

// ── Message grouping (for UI rendering) ───────────────────────────────────────

export interface IMessageGroup {
  senderId: string;
  senderName: string;
  senderPhotoURL: string | null;
  messages: IMessage[];
  isSentByMe: boolean;
  // First message timestamp used for date separators
  firstCreatedAt: number;
}

// ── Date separator ────────────────────────────────────────────────────────────

export interface IDateSeparator {
  type: "date-separator";
  label: string;                 // "Today", "Yesterday", "Jan 14, 2025"
  timestamp: number;
}

// Union type for MessageList rendering
export type ChatListItem = IMessageGroup | IDateSeparator;

// ── Helper type guard ─────────────────────────────────────────────────────────
export function isDateSeparator(item: ChatListItem): item is IDateSeparator {
  return "type" in item && item.type === "date-separator";
}
