export type WorkoutDayId = "upper" | "lower" | "warmup" | "reset";

export type ExerciseForSession = {
  id: string;
  primaryName: string;
  alternateName: string | null;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  notes: string | null;
  incrementLbs: number;
  lastWeight: number | null;
  suggestedWeight: number | null;
};
