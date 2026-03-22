"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type CalendarSession = {
  id: string;
  startedAt: string | Date;
  workoutDayId: string;
};

type Props = { sessions: CalendarSession[] };

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function WorkoutCalendar({ sessions }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build a map: "YYYY-MM-DD" -> session
  const byDate = new Map<string, CalendarSession>();
  for (const s of sessions) {
    const d = new Date(s.startedAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    byDate.set(key, s);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prev} className="rounded-lg p-1 transition-colors" style={{ color: "rgba(235,240,244,0.4)" }}>
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold font-mono text-white">{MONTHS[month]} {year}</span>
        <button onClick={next} className="rounded-lg p-1 transition-colors" style={{ color: "rgba(235,240,244,0.4)" }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAYS.map(d => (
          <span key={d} className="text-xs font-mono" style={{ color: "rgba(235,240,244,0.2)" }}>{d}</span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key = `${year}-${month}-${day}`;
          const session = byDate.get(key);
          const accentColor = session?.workoutDayId === "upper" ? "var(--u)" : session ? "var(--e2)" : null;

          const inner = (
            <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full">
              {accentColor && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: accentColor, opacity: 0.15 }}
                />
              )}
              <span
                className="text-sm"
                style={{
                  color: isToday(day) ? "white" : accentColor ? "white" : "rgba(255,255,255,0.3)",
                  fontWeight: isToday(day) || accentColor ? 600 : 400,
                }}
              >
                {day}
              </span>
              {accentColor && (
                <span
                  className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                  style={{ background: accentColor }}
                />
              )}
            </div>
          );

          return session ? (
            <Link key={i} href={`/history/${session.id}`}>{inner}</Link>
          ) : (
            <div key={i}>{inner}</div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 justify-center">
        <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "rgba(235,240,244,0.35)" }}>
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--u)" }} /> Upper
        </span>
        <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "rgba(235,240,244,0.35)" }}>
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--e2)" }} /> Lower
        </span>
      </div>
    </div>
  );
}
