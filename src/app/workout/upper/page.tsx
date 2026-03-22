import { getExercisesForDay } from "@/lib/db/getExercises";
import { SessionRunner } from "@/components/session/SessionRunner";

export default async function UpperDayPage() {
  const exercises = await getExercisesForDay("upper");
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Upper Day</h1>
      <SessionRunner workoutDayId="upper" exercises={exercises} />
    </div>
  );
}
