import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { formatDate, formatDistanceToNow } from "@/lib/utils/dates";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const lastSession = await prisma.session.findFirst({
    orderBy: { startedAt: "desc" },
    where: { workoutDay: { id: { in: ["upper", "lower"] } } },
    include: { workoutDay: true, setLogs: true },
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Date */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--white)" }}>Today</h1>
        <p className="text-sm font-mono mt-0.5" style={{ color: "rgba(235,240,244,0.4)" }}>
          {formatDate(new Date())}
        </p>
      </div>

      {/* Primary day buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/workout/upper"
          className="group flex flex-col gap-2 rounded-2xl p-5 transition-all"
          style={{
            background: "rgba(247, 148, 50, 0.08)",
            border: "1px solid rgba(247, 148, 50, 0.25)",
          }}
        >
          <span
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: "rgba(247, 148, 50, 0.7)" }}
          >
            Upper
          </span>
          <span className="text-lg font-bold leading-tight" style={{ color: "var(--white)" }}>
            Push &<br />Pull
          </span>
          <span className="text-xs mt-1" style={{ color: "rgba(235,240,244,0.35)" }}>
            Bench · Row · Press · Arms
          </span>
          <div className="mt-2 flex items-center gap-1" style={{ color: "var(--u)" }}>
            <span className="text-xs font-semibold font-mono">Start</span>
            <ArrowRight size={12} />
          </div>
        </Link>

        <Link
          href="/workout/lower"
          className="group flex flex-col gap-2 rounded-2xl p-5 transition-all"
          style={{
            background: "rgba(108, 188, 130, 0.08)",
            border: "1px solid rgba(108, 188, 130, 0.25)",
          }}
        >
          <span
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: "rgba(108, 188, 130, 0.7)" }}
          >
            Lower
          </span>
          <span className="text-lg font-bold leading-tight" style={{ color: "var(--white)" }}>
            Legs &<br />Hinge
          </span>
          <span className="text-xs mt-1" style={{ color: "rgba(235,240,244,0.35)" }}>
            Squat · Press · Deadlift · Glutes
          </span>
          <div className="mt-2 flex items-center gap-1" style={{ color: "var(--e2)" }}>
            <span className="text-xs font-semibold font-mono">Start</span>
            <ArrowRight size={12} />
          </div>
        </Link>
      </div>

      {/* Secondary routines */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/workout/warmup"
          className="rounded-xl px-4 py-3 text-sm font-medium transition-all"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "rgba(235,240,244,0.55)",
          }}
        >
          Warm-Up
        </Link>
        <Link
          href="/workout/reset"
          className="rounded-xl px-4 py-3 text-sm font-medium transition-all"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "rgba(235,240,244,0.55)",
          }}
        >
          Daily Reset
        </Link>
      </div>

      {/* Last session */}
      {lastSession && (
        <div>
          <p className="mb-2 text-xs font-mono uppercase tracking-widest" style={{ color: "rgba(235,240,244,0.3)" }}>
            Last session
          </p>
          <Link
            href={`/history/${lastSession.id}`}
            className="group flex items-center justify-between rounded-xl px-4 py-4 transition-all"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <p className="font-semibold" style={{ color: "var(--white)" }}>{lastSession.workoutDay.name}</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: "rgba(235,240,244,0.35)" }}>
                {formatDistanceToNow(new Date(lastSession.startedAt))}
              </p>
            </div>
            <div className="flex items-center gap-2" style={{ color: "rgba(235,240,244,0.4)" }}>
              <span className="text-sm">{lastSession.setLogs.length} sets</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
