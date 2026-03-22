"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, History, BookOpen, Trophy } from "lucide-react";

const tabs = [
  { href: "/", label: "Today", icon: Dumbbell },
  { href: "/history", label: "History", icon: History },
  { href: "/exercises", label: "Exercises", icon: BookOpen },
  { href: "/records", label: "Records", icon: Trophy },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background: "rgba(22, 24, 26, 0.92)",
        borderTop: "1px solid rgba(235,240,244,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex max-w-lg">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
              style={{ color: active ? "var(--e2)" : "rgba(235,240,244,0.3)" }}
            >
              <Icon size={22} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
