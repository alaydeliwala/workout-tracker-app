import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { WeightProgressChart } from "@/components/exercises/WeightProgressChart";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      workoutDay: true,
      records: true,
      setLogs: {
        orderBy: { loggedAt: "asc" },
        include: { session: true },
        take: 100,
      },
    },
  });

  if (!exercise) notFound();

  // Build chart data: max weight per session
  const sessionMap = new Map<string, { date: Date; maxWeight: number }>();
  for (const log of exercise.setLogs) {
    const existing = sessionMap.get(log.sessionId);
    if (!existing || log.weightLbs > existing.maxWeight) {
      sessionMap.set(log.sessionId, { date: new Date(log.session.startedAt), maxWeight: log.weightLbs });
    }
  }
  const chartData = Array.from(sessionMap.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((d) => ({
      date: d.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: d.maxWeight,
    }));

  // Recent sets (last 3 sessions)
  const recentSessionIds = [...new Set(exercise.setLogs.map((s) => s.sessionId))].slice(-3);
  const recentSets = exercise.setLogs.filter((s) => recentSessionIds.includes(s.sessionId));

  return (
    <div>
      <Link href="/exercises" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        ← Exercises
      </Link>

      <h1 className="text-2xl font-bold text-white">{exercise.primaryName}</h1>
      <p className="text-sm text-zinc-400">{exercise.workoutDay.name}</p>

      {exercise.alternateName && (
        <div className="mt-2 rounded-xl bg-zinc-800/60 px-3 py-2 text-sm text-zinc-400">
          Alternate: <span className="text-zinc-200">{exercise.alternateName}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-zinc-900 p-3 text-center">
          <p className="text-lg font-bold text-white">{exercise.sets}×{exercise.repsMin}–{exercise.repsMax}</p>
          <p className="text-xs text-zinc-500">Sets×Reps</p>
        </div>
        <div className="rounded-xl bg-zinc-900 p-3 text-center">
          <p className="text-lg font-bold text-white">
            {exercise.restSeconds >= 60 ? `${exercise.restSeconds / 60}m` : `${exercise.restSeconds}s`}
          </p>
          <p className="text-xs text-zinc-500">Rest</p>
        </div>
        <div className="rounded-xl bg-zinc-900 p-3 text-center">
          <p className="text-lg font-bold text-yellow-400">{exercise.records[0]?.weightLbs ?? "—"}</p>
          <p className="text-xs text-zinc-500">PR (lbs)</p>
        </div>
      </div>

      {/* Form cues */}
      {exercise.notes && (
        <div className="mt-4 rounded-2xl bg-zinc-900 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">Form Cues</h3>
          <p className="text-sm leading-relaxed text-zinc-300">{exercise.notes}</p>
        </div>
      )}

      {/* Progression rule */}
      <div className="mt-3 rounded-xl bg-zinc-900/50 px-4 py-3 text-xs text-zinc-500">
        Add <strong className="text-zinc-300">{exercise.incrementLbs} lbs</strong> when you hit {exercise.repsMax} reps on all sets.
      </div>

      {/* Chart */}
      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-zinc-400">Weight Over Time</h3>
        <WeightProgressChart data={chartData} />
      </div>

      {/* Recent sets */}
      {recentSets.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-zinc-400">Recent Sets</h3>
          <div className="flex flex-col gap-1">
            {recentSets.map((log) => (
              <div key={log.id} className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-2 text-sm">
                <span className="w-5 text-zinc-500">#{log.setNumber}</span>
                <span className="font-semibold text-white">{log.weightLbs} lbs</span>
                <span className="text-zinc-400">× {log.reps}</span>
                <span className="ml-auto text-xs text-zinc-600">
                  {new Date(log.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
