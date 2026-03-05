"use client";

import { motion } from "motion/react";
import type { IMessageGroup } from "@/types/chat";
import ChatTimestamp from "./ChatTimestamp";

interface MessageBubbleProps {
  group: IMessageGroup;
  myUid: string;
}

const AVATAR_COLORS = [
  "#6366f1",
  "#818cf8",
  "#4f46e5",
  "#a5b4fc",
  "#4338ca",
  "#c7d2fe",
];

function getAvatarColor(uid: string): string {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function getBubbleRadius(
  isSent: boolean,
  position: "first" | "middle" | "last" | "only"
): string {
  if (position === "only") {
    return isSent
      ? "20px 20px 6px 20px"
      : "20px 20px 20px 6px";
  }
  if (isSent) {
    switch (position) {
      case "first":
        return "20px 20px 6px 20px";
      case "middle":
        return "20px 6px 6px 20px";
      case "last":
        return "20px 6px 20px 20px";
    }
  }
  // received
  switch (position) {
    case "first":
      return "20px 20px 20px 6px";
    case "middle":
      return "6px 20px 20px 6px";
    case "last":
      return "6px 20px 20px 20px";
  }
}

function getPosition(
  index: number,
  total: number
): "first" | "middle" | "last" | "only" {
  if (total === 1) return "only";
  if (index === 0) return "first";
  if (index === total - 1) return "last";
  return "middle";
}

export default function MessageBubble({ group, myUid }: MessageBubbleProps) {
  const isSent = group.isSentByMe;
  const total = group.messages.length;

  const bubbleContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isSent ? "row-reverse" : "row",
    alignItems: "flex-end",
    gap: "12px",
    marginBottom: "16px",
    alignSelf: isSent ? "flex-end" : "flex-start",
    maxWidth: "72%",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isSent ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={bubbleContainerStyle}
    >
      {/* Avatar column */}
      <div
        style={{
          width: "32px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Show avatar only on last message of group */}
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            overflow: "hidden",
            background: group.senderPhotoURL
              ? "transparent"
              : getAvatarColor(group.senderId),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {group.senderPhotoURL ? (
            <img
              src={group.senderPhotoURL}
              alt={group.senderName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            getInitial(group.senderName)
          )}
        </div>
      </div>

      {/* Content column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isSent ? "flex-end" : "flex-start",
          gap: "3px",
          maxWidth: "100%",
        }}
      >
        {/* Sender name (only for received messages) */}
        {!isSent && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "13px",
              color: "#6366f1",
              marginBottom: "3px",
              paddingLeft: "4px",
            }}
          >
            {group.senderName}
          </span>
        )}

        {/* Message bubbles */}
        {group.messages.map((msg, idx) => {
          const position = getPosition(idx, total);
          const radius = getBubbleRadius(isSent, position);

          return (
            <div
              key={msg.id}
              className="message-bubble"
              style={{
                background: isSent
                  ? "linear-gradient(135deg, #4f46e5, #6366f1)"
                  : "#1e293b",
                border: isSent ? "none" : "1px solid #334155",
                color: isSent ? "#ffffff" : "#e2e8f0",
                borderRadius: radius,
                padding: "14px 18px",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: 1.6,
                maxWidth: "100%",
                wordBreak: "break-word",
                boxShadow: isSent
                  ? "0 4px 16px rgba(99, 102, 241, 0.3)"
                  : "none",
                transition: "filter 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                if (isSent) {
                  (e.currentTarget as HTMLElement).style.filter =
                    "brightness(1.08)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.filter = "none";
              }}
            >
              {msg.text}
            </div>
          );
        })}

        {/* Timestamp (last message of group) */}
        <div
          style={{
            marginTop: "6px",
            paddingLeft: isSent ? undefined : "4px",
            paddingRight: isSent ? "4px" : undefined,
          }}
        >
          <ChatTimestamp
            timestamp={group.messages[total - 1].createdAt}
          />
        </div>
      </div>
    </motion.div>
  );
}
