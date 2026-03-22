import { prisma } from "@/lib/db/prisma";
import { SessionHistoryCard } from "@/components/history/SessionHistoryCard";
import { WorkoutCalendar } from "@/components/history/WorkoutCalendar";

export default async function HistoryPage() {
  const sessions = await prisma.session.findMany({
    orderBy: { startedAt: "desc" },
    take: 50,
    include: {
      workoutDay: true,
      setLogs: true,
    },
  });

  const calendarSessions = sessions.map((s) => ({
    id: s.id,
    startedAt: s.startedAt,
    workoutDayId: s.workoutDayId,
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">History</h1>
      <div className="mb-6">
        <WorkoutCalendar sessions={calendarSessions} />
      </div>
      {sessions.length === 0 ? (
        <p className="text-center text-zinc-500 mt-16">No sessions yet. Start your first workout!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s) => (
            <SessionHistoryCard key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}
