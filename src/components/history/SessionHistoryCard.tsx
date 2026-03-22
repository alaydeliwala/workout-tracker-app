import Link from "next/link";
import { formatDistanceToNow } from "@/lib/utils/dates";
import { totalVolume } from "@/lib/utils/progression";

type SetLog = { weightLbs: number; reps: number };

type Props = {
  session: {
    id: string;
    startedAt: string | Date;
    completedAt: string | Date | null;
    workoutDay: { name: string };
    setLogs: SetLog[];
  };
};

export function SessionHistoryCard({ session }: Props) {
  const vol = totalVolume(session.setLogs);
  const duration = session.completedAt
    ? Math.round((new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)
    : null;

  return (
    <Link
      href={`/history/${session.id}`}
      className="flex items-center justify-between rounded-2xl bg-zinc-900 p-4 hover:bg-zinc-800 transition-colors"
    >
      <div>
        <p className="font-bold text-white">{session.workoutDay.name}</p>
        <p className="text-sm text-zinc-400">{formatDistanceToNow(new Date(session.startedAt))}</p>
      </div>
      <div className="text-right text-sm text-zinc-400">
        {duration !== null && <p>{duration} min</p>}
        <p>{Math.round(vol).toLocaleString()} lbs vol.</p>
        <p>{session.setLogs.length} sets</p>
      </div>
    </Link>
  );
}
