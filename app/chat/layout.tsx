export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No padding, no margin — ChatShell handles its own layout
  return <>{children}</>;
}
