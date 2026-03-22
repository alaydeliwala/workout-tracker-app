import { getExercisesForDay } from "@/lib/db/getExercises";
import { SessionRunner } from "@/components/session/SessionRunner";

export default async function LowerDayPage() {
  const exercises = await getExercisesForDay("lower");
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Lower Day</h1>
      <SessionRunner workoutDayId="lower" exercises={exercises} />
    </div>
  );
}
