import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Smart Garden Dashboard",
  description: "Real-time IoT monitoring for the smart garden",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}
