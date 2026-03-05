"use client";

export function formatChatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
}

interface ChatTimestampProps {
  timestamp: number;
  className?: string;
}

export default function ChatTimestamp({
  timestamp,
  className,
}: ChatTimestampProps) {
  const formatted = formatChatTime(timestamp);
  const isoString = new Date(timestamp).toISOString();

  return (
    <time
      dateTime={isoString}
      className={className}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "11px",
        color: "var(--text-secondary)",
        lineHeight: 1,
      }}
    >
      {formatted}
    </time>
  );
}
