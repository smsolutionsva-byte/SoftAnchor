"use client";

import { useAuth } from "@/context/AuthContext";

interface ChatHeaderProps {
  roomName: string;
  participantCount?: number;
  onBack?: () => void;
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export default function ChatHeader({
  roomName,
  participantCount,
  onBack,
}: ChatHeaderProps) {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: "72px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "0 32px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--glass-border)",
        boxShadow: "0 1px 0 var(--glass-border)",
        gap: "16px",
      }}
    >
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Go back"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "transparent",
            border: "1px solid var(--glass-border)",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            flexShrink: 0,
          }}
        >
          ←
        </button>
      )}

      {/* Room icon */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #818cf8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          flexShrink: 0,
        }}
      >
        💬
      </div>

      {/* Room info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "18px",
            color: "var(--text-primary)",
          }}
        >
          {roomName}
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {/* Green pulse dot */}
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "13px",
              color: "var(--text-secondary)",
            }}
          >
            {participantCount
              ? `${participantCount} members`
              : "Active now"}
          </span>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User avatar */}
      {user && (
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? "User"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            getInitial(user.displayName ?? user.email ?? "U")
          )}
        </div>
      )}
    </header>
  );
}
