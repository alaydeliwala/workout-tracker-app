import { prisma } from "./prisma";
import { suggestNextWeight } from "@/lib/utils/progression";
import type { ExerciseForSession, WorkoutDayId } from "@/types/workout";

export async function getExercisesForDay(workoutDayId: WorkoutDayId): Promise<ExerciseForSession[]> {
  const exercises = await prisma.exercise.findMany({
    where: { workoutDayId },
    orderBy: { orderIndex: "asc" },
    include: {
      setLogs: {
        where: {
          session: {
            completedAt: { not: null },
          },
        },
        orderBy: { loggedAt: "desc" },
        take: 40,
        include: { session: true },
      },
    },
  });

  return exercises.map((ex) => {
    const lastSessionId = ex.setLogs[0]?.sessionId ?? null;
    const lastSets = lastSessionId
      ? ex.setLogs.filter((s) => s.sessionId === lastSessionId)
      : [];
    return {
      id: ex.id,
      primaryName: ex.primaryName,
      alternateName: ex.alternateName,
      sets: ex.sets,
      repsMin: ex.repsMin,
      repsMax: ex.repsMax,
      restSeconds: ex.restSeconds,
      notes: ex.notes,
      incrementLbs: ex.incrementLbs,
      lastWeight: lastSets[0]?.weightLbs ?? null,
      suggestedWeight: suggestNextWeight(ex, lastSets),
    };
  });
}
