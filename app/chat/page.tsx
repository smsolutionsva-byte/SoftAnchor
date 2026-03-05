"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatShell from "@/components/chat/ChatShell";
import { useAuth } from "@/context/AuthContext";

// Default room — in a multi-room app, this would come from URL params
// For now, use a single shared room: "general"
const DEFAULT_ROOM_ID = "general";

export default function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  // During auth check or redirect — show nothing
  if (isLoading || !user) return null;

  return (
    <ChatShell roomId={DEFAULT_ROOM_ID} roomName="SoftAnchor Chat 💜" />
  );
}
