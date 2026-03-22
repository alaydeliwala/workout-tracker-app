import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils/dates";

export default async function RecordsPage() {
  const records = await prisma.personalRecord.findMany({
    include: {
      exercise: { include: { workoutDay: true } },
    },
    orderBy: { achievedAt: "desc" },
  });

  const upperRecords = records.filter((r) => r.exercise.workoutDayId === "upper");
  const lowerRecords = records.filter((r) => r.exercise.workoutDayId === "lower");

  const RecordGroup = ({
    title,
    items,
  }: {
    title: string;
    items: typeof records;
  }) => (
    <div>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-600 py-4">No records yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((r) => (
            <Link
              key={r.id}
              href={`/exercises/${r.exerciseId}`}
              className="flex items-center justify-between rounded-xl bg-zinc-900 p-4 hover:bg-zinc-800 transition-colors"
            >
              <div>
                <p className="font-semibold text-white">{r.exercise.primaryName}</p>
                <p className="text-xs text-zinc-500">{formatDate(new Date(r.achievedAt))}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-yellow-400">{r.weightLbs} lbs</p>
                <p className="text-xs text-zinc-400">× {r.reps} reps</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Personal Records</h1>
      <div className="flex flex-col gap-8">
        <RecordGroup title="Upper Day" items={upperRecords} />
        <RecordGroup title="Lower Day" items={lowerRecords} />
      </div>
    </div>
  );
}
