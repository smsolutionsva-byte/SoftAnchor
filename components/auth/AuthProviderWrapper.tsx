"use client";

import { AuthProvider } from "@/context/AuthContext";
import AuthGate from "@/components/auth/AuthGate";

export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
