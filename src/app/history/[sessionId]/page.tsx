import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils/dates";
import { totalVolume } from "@/lib/utils/progression";
import { DeleteSessionButton } from "@/components/session/DeleteSessionButton";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      workoutDay: true,
      setLogs: {
        orderBy: { loggedAt: "asc" },
        include: { exercise: true },
      },
    },
  });

  if (!session) notFound();

  // Group sets by exercise
  const byExercise = new Map<string, typeof session.setLogs>();
  for (const log of session.setLogs) {
    const arr = byExercise.get(log.exerciseId) ?? [];
    arr.push(log);
    byExercise.set(log.exerciseId, arr);
  }

  const vol = totalVolume(session.setLogs);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/history" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
          ← History
        </Link>
        <DeleteSessionButton sessionId={sessionId} />
      </div>

      <h1 className="text-2xl font-bold text-white">{session.workoutDay.name}</h1>
      <p className="text-sm text-zinc-400">{formatDate(new Date(session.startedAt))}</p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-zinc-900 p-3 text-center">
          <p className="text-lg font-bold text-white">{session.setLogs.length}</p>
          <p className="text-xs text-zinc-500">Sets</p>
        </div>
        <div className="rounded-xl bg-zinc-900 p-3 text-center">
          <p className="text-lg font-bold text-white">{Math.round(vol).toLocaleString()}</p>
          <p className="text-xs text-zinc-500">lbs vol.</p>
        </div>
        <div className="rounded-xl bg-zinc-900 p-3 text-center">
          <p className="text-lg font-bold text-white">
            {session.completedAt
              ? formatDuration(new Date(session.startedAt), new Date(session.completedAt))
              : "—"}
          </p>
          <p className="text-xs text-zinc-500">Duration</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {Array.from(byExercise.entries()).map(([exerciseId, logs]) => {
          const ex = logs[0].exercise;
          return (
            <div key={exerciseId} className="rounded-2xl bg-zinc-900 p-4">
              <Link href={`/exercises/${exerciseId}`} className="font-bold text-white hover:text-blue-400 transition-colors">
                {ex.primaryName}
              </Link>
              <div className="mt-2 space-y-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 text-sm">
                    <span className="w-5 text-zinc-500">#{log.setNumber}</span>
                    <span className="font-semibold text-white">{log.weightLbs} lbs</span>
                    <span className="text-zinc-400">× {log.reps} reps</span>
                    {log.usedAlternate && (
                      <span className="text-xs text-zinc-500">(alt.)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
