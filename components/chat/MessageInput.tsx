"use client";

import { useState, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { motion } from "motion/react";

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>;
  onTypingChange: (isTyping: boolean) => void;
  disabled?: boolean;
}

function SendIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default function MessageInput({
  onSendMessage,
  onTypingChange,
  disabled = false,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    autoResize();
    onTypingChange(e.target.value.length > 0);
  };

  const handleSend = async () => {
    if (!text.trim() || isSending) return;
    const toSend = text;
    setText(""); // optimistic clear
    if (textareaRef.current) {
      textareaRef.current.style.height = "52px"; // reset height
    }
    onTypingChange(false); // stop typing indicator
    setIsSending(true);
    try {
      await onSendMessage(toSend);
    } catch {
      setText(toSend); // restore if failed
    } finally {
      setIsSending(false);
      textareaRef.current?.focus(); // keep focus for rapid messaging
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") {
      setText("");
      onTypingChange(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "52px";
      }
    }
  };

  const canSend = text.trim().length > 0 && !isSending && !disabled;

  const sendButtonStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "none",
    cursor: canSend ? "pointer" : "not-allowed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    flexShrink: 0,
    background: canSend
      ? "linear-gradient(135deg, #4f46e5, #6366f1)"
      : "#1e293b",
    boxShadow: canSend
      ? "0 4px 16px rgba(99, 102, 241, 0.4)"
      : "none",
    opacity: canSend ? 1 : 0.5,
  };

  return (
    <div
      style={{
        padding: "20px 32px 28px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--glass-border)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: "12px",
        }}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          className="chat-textarea"
          rows={1}
          style={{
            flex: 1,
            minHeight: "52px",
            maxHeight: "160px",
            padding: "14px 20px",
            background: "#0f172a",
            border: "1.5px solid #334155",
            borderRadius: "26px",
            color: "#e2e8f0",
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: 1.5,
            resize: "none",
            outline: "none",
          }}
        />

        {/* Send button */}
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          style={sendButtonStyle}
          whileHover={canSend ? { scale: 1.08, filter: "brightness(1.1)" } : undefined}
          whileTap={canSend ? { scale: 0.92 } : undefined}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <SendIcon />
        </motion.button>
      </div>

      {/* Hint text */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          fontSize: "11px",
          color: "#334155",
          textAlign: "center",
          marginTop: "8px",
        }}
      >
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
