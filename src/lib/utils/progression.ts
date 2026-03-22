import type { SetLog, Exercise } from "@/generated/prisma";

export function suggestNextWeight(
  exercise: Exercise,
  lastSets: SetLog[]
): number | null {
  if (lastSets.length === 0) return null;

  const expectedSets = exercise.sets;
  const completedSets = lastSets.slice(0, expectedSets);

  if (completedSets.length < expectedSets) return null;

  const allHitMax = completedSets.every((s) => s.reps >= exercise.repsMax);
  if (!allHitMax) return null;

  const lastWeight = Math.max(...completedSets.map((s) => s.weightLbs));
  const suggested = lastWeight + exercise.incrementLbs;
  // round to nearest 2.5
  return Math.round(suggested / 2.5) * 2.5;
}

export function totalVolume(sets: { weightLbs: number; reps: number }[]): number {
  return sets.reduce((sum, s) => sum + s.weightLbs * s.reps, 0);
}
