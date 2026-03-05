"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import GlassCard from "@/components/ui/GlassCard";

export default function ChatNavButton() {
  const router = useRouter();

  return (
    <GlassCard
      onClick={() => router.push("/chat")}
      padding="16px 20px"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
          }}
        >
          💬
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "15px",
              color: "var(--text-primary)",
            }}
          >
            SoftAnchor Chat
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "13px",
              color: "var(--text-secondary)",
            }}
          >
            Connect with others 💜
          </span>
        </div>

        {/* Arrow */}
        <div style={{ marginLeft: "auto", color: "var(--text-secondary)" }}>
          →
        </div>
      </div>
    </GlassCard>
  );
}
