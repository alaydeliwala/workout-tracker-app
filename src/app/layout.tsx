import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Alay's GYM Grind",
  description: "Track your gym sessions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="mx-auto max-w-lg px-4 pt-6 pb-2">
          <span
            className="text-xs font-black uppercase tracking-[0.3em] font-mono"
            style={{
              background: "linear-gradient(90deg, var(--u), var(--n), var(--i), var(--v), var(--e1), var(--r), var(--s), var(--e2))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Alay's GYM Grind
          </span>
        </header>
        <main className="mx-auto max-w-lg px-4 pb-28 pt-2">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
