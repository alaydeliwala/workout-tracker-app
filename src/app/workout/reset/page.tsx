import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function ResetPage() {
  const exercises = await prisma.exercise.findMany({
    where: { workoutDayId: "reset" },
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Daily Reset</h1>
      <p className="mb-6 text-sm text-zinc-400">~5 min · After work, at home</p>
      <div className="flex flex-col gap-3">
        {exercises.map((ex, i) => (
          <div key={ex.id} className="rounded-2xl bg-zinc-900 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-white">{ex.primaryName}</h3>
                {ex.notes && <p className="mt-1 text-sm text-zinc-400">{ex.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href="/" className="mt-6 flex h-12 items-center justify-center rounded-xl bg-zinc-800 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors">
        Done
      </Link>
    </div>
  );
}
