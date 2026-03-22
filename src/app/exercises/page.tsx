import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function ExercisesPage() {
  const days = await prisma.workoutDay.findMany({
    where: { id: { in: ["upper", "lower"] } },
    include: {
      exercises: {
        orderBy: { orderIndex: "asc" },
        include: { records: true },
      },
    },
    orderBy: { id: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Exercises</h1>
      <div className="flex flex-col gap-6">
        {days.map((day) => (
          <div key={day.id}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
              {day.name}
            </h2>
            <div className="flex flex-col gap-2">
              {day.exercises.map((ex) => (
                <Link
                  key={ex.id}
                  href={`/exercises/${ex.id}`}
                  className="flex items-center justify-between rounded-xl bg-zinc-900 p-4 hover:bg-zinc-800 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-white">{ex.primaryName}</p>
                    {ex.alternateName && (
                      <p className="text-xs text-zinc-500">Alt: {ex.alternateName}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-zinc-400">
                    <p>{ex.sets}×{ex.repsMin}–{ex.repsMax}</p>
                    {ex.records[0] && (
                      <p className="text-xs text-yellow-500">{ex.records[0].weightLbs} lbs PR</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
