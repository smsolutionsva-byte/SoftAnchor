import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import AppShell from "@/components/layout/AppShell";
import HeartbeatCursor from "@/components/cursor/HeartbeatCursor";
import AuthProviderWrapper from "@/components/auth/AuthProviderWrapper";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "SoftAnchor",
  description: "Your brain's gentle GPS 💜",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable}`}
      data-theme="gentle-drift"
      suppressHydrationWarning={true}
    >
      <body>
        <AuthProviderWrapper>
          <AppShell>{children}</AppShell>
          <HeartbeatCursor />
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
