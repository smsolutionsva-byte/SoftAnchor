"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ChatListItem } from "@/types/chat";
import { isDateSeparator } from "@/types/chat";
import MessageBubble from "./MessageBubble";
import EmptyChat from "./EmptyChat";
import GlassCard from "@/components/ui/GlassCard";
import SoftButton from "@/components/ui/SoftButton";

interface MessageListProps {
  groupedItems: ChatListItem[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  error: string | null;
  myUid: string;
}

// ── Date separator (inline) ──────────────────────────────────────────────────

interface DateSeparatorComponentProps {
  label: string;
}

function DateSeparator({ label }: DateSeparatorComponentProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        margin: "24px 0 16px",
      }}
    >
      <div
        style={{ flex: 1, height: "1px", background: "var(--glass-border)" }}
      />
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          color: "var(--text-secondary)",
          padding: "4px 14px",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          borderRadius: "999px",
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </span>
      <div
        style={{ flex: 1, height: "1px", background: "var(--glass-border)" }}
      />
    </div>
  );
}

// ── Skeleton loading bubbles ──────────────────────────────────────────────────

function SkeletonBubbles() {
  const skeletons = [
    { width: "40%", height: "48px", align: "flex-start" as const },
    { width: "60%", height: "72px", align: "flex-end" as const },
    { width: "45%", height: "56px", align: "flex-start" as const },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "24px 0",
      }}
    >
      {skeletons.map((s, i) => {
        const skeletonStyle: React.CSSProperties = {
          width: s.width,
          height: s.height,
          borderRadius: "20px",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          alignSelf: s.align,
        };
        return (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            style={skeletonStyle}
          />
        );
      })}
    </div>
  );
}

export default function MessageList({
  groupedItems,
  isLoading,
  hasMore,
  onLoadMore,
  error,
  myUid,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 120;
    isNearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  // Auto-scroll on new messages when near bottom
  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupedItems]);

  // Always scroll to bottom on first load
  useEffect(() => {
    if (!isLoading) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    }
  }, [isLoading]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading && groupedItems.length === 0) {
    return (
      <div
        className="chat-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SkeletonBubbles />
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="chat-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <GlassCard padding="24px 32px">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "var(--text-secondary)",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        </GlassCard>
        <SoftButton
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Try again
        </SoftButton>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!isLoading && groupedItems.length === 0) {
    return (
      <div
        className="chat-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <EmptyChat />
      </div>
    );
  }

  // ── Message list ──────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="chat-scroll"
      style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {/* Load more button */}
      {hasMore && (() => {
        const loadMoreStyle: React.CSSProperties = {
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        };
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={loadMoreStyle}
          >
            <SoftButton
              variant="ghost"
              size="sm"
              onClick={onLoadMore}
            >
              ↑ Load earlier messages
            </SoftButton>
          </motion.div>
        );
      })()}

      <AnimatePresence mode="sync">
        {groupedItems.map((item, i) => {
          if (isDateSeparator(item)) {
            return <DateSeparator key={`date-${item.timestamp}`} label={item.label} />;
          }
          return (
            <MessageBubble
              key={item.messages[0].id}
              group={item}
              myUid={myUid}
            />
          );
        })}
      </AnimatePresence>

      <div ref={bottomRef} style={{ height: "1px" }} />
    </div>
  );
}
