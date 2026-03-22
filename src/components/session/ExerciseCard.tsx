"use client";
import { useState } from "react";
import { SetInputRow } from "./SetInputRow";
import { useSessionStore } from "@/lib/stores/sessionStore";
import { useTimerStore } from "@/lib/stores/timerStore";
import type { ExerciseForSession } from "@/types/workout";

type Props = {
  exercise: ExerciseForSession;
  sessionId: string;
  nextExerciseName?: string;
};

export function ExerciseCard({ exercise, sessionId, nextExerciseName }: Props) {
  const [useAlternate, setUseAlternate] = useState(false);
  const { loggedSets, logSet } = useSessionStore();
  const { startTimer } = useTimerStore();

  const completedSets = loggedSets.filter((s) => s.exerciseId === exercise.id).length;
  const defaultWeight = exercise.suggestedWeight ?? exercise.lastWeight ?? 0;
  const restLabel = exercise.restSeconds >= 60 ? `${exercise.restSeconds / 60}m` : `${exercise.restSeconds}s`;

  const handleLog = async (weightLbs: number, reps: number) => {
    const setNumber = completedSets + 1;
    const res = await fetch(`/api/sessions/${sessionId}/sets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseId: exercise.id, setNumber, weightLbs, reps, usedAlternate: useAlternate }),
    });
    const data = await res.json();
    logSet({ exerciseId: exercise.id, setNumber, weightLbs, reps, usedAlternate: useAlternate, isPR: data.isPR });
    startTimer(exercise.restSeconds, nextExerciseName);
    return { isPR: data.isPR };
  };

  const name = useAlternate && exercise.alternateName ? exercise.alternateName : exercise.primaryName;

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Name */}
      <div className="mb-1">
        <h2 className="text-xl font-bold leading-tight" style={{ color: "var(--white)" }}>{name}</h2>
      </div>

      {/* Meta row */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono" style={{ color: "rgba(235,240,244,0.4)" }}>
        <span>{exercise.sets} × {exercise.repsMin}–{exercise.repsMax}</span>
        <span>·</span>
        <span>{restLabel} rest</span>
        {exercise.suggestedWeight && exercise.suggestedWeight !== exercise.lastWeight && (
          <>
            <span>·</span>
            <span style={{ color: "var(--e2)" }}>↑ try {exercise.suggestedWeight} lbs</span>
          </>
        )}
        {!exercise.suggestedWeight && exercise.lastWeight && (
          <>
            <span>·</span>
            <span>last {exercise.lastWeight} lbs</span>
          </>
        )}
      </div>

      {/* Alternate toggle — clearly labeled */}
      {exercise.alternateName && (
        <div
          className="mb-3 flex items-center justify-between rounded-xl px-3 py-2"
          style={{ background: "rgba(235,240,244,0.04)", border: "1px solid rgba(235,240,244,0.08)" }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "rgba(235,240,244,0.3)" }}>
              Alt
            </span>
            <span className="text-sm font-medium" style={{ color: useAlternate ? "var(--r)" : "rgba(235,240,244,0.5)" }}>
              {exercise.alternateName}
            </span>
          </div>
          <button
            onClick={() => setUseAlternate((v) => !v)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold font-mono transition-all"
            style={
              useAlternate
                ? { background: "rgba(28,153,174,0.15)", border: "1px solid rgba(28,153,174,0.3)", color: "var(--r)" }
                : { background: "var(--surface)", border: "1px solid var(--border)", color: "rgba(235,240,244,0.5)" }
            }
          >
            {useAlternate ? "Using alt" : "Switch"}
          </button>
        </div>
      )}

      {/* Notes — always visible */}
      {exercise.notes && (
        <p
          className="mb-3 rounded-xl p-3 text-xs leading-relaxed"
          style={{ background: "rgba(28,153,174,0.07)", border: "1px solid rgba(28,153,174,0.15)", color: "rgba(235,240,244,0.7)" }}
        >
          {exercise.notes}
        </p>
      )}

      {/* Sets table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-xs font-mono" style={{ color: "rgba(235,240,244,0.3)" }}>
            <th className="w-6 pb-2 font-medium">#</th>
            <th className="pb-2 font-medium">Weight</th>
            <th className="pb-2 font-medium">Reps</th>
            <th className="w-14 pb-2" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: exercise.sets }, (_, i) => (
            <SetInputRow
              key={i}
              setNumber={i + 1}
              defaultWeight={defaultWeight}
              repsMin={exercise.repsMin}
              repsMax={exercise.repsMax}
              onLog={handleLog}
              isLogged={i < completedSets}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
