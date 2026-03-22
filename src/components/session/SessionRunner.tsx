"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExerciseCard } from "./ExerciseCard";
import { RestTimer } from "./RestTimer";
import { useSessionStore } from "@/lib/stores/sessionStore";
import type { ExerciseForSession, WorkoutDayId } from "@/types/workout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatTime } from "@/lib/utils/dates";

type Props = {
  workoutDayId: WorkoutDayId;
  exercises: ExerciseForSession[];
};

export function SessionRunner({ workoutDayId, exercises }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const { startSession, clearSession, loggedSets } = useSessionStore();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workoutDayId }),
    })
      .then((r) => r.json())
      .then((session) => {
        if (cancelled) return;
        setSessionId(session.id);
        startSession(session.id, workoutDayId);
      });
    return () => {
      cancelled = true;
      clearSession();
    };
  }, [workoutDayId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const handleFinish = async () => {
    if (!sessionId) return;
    setFinishing(true);
    await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    clearSession();
    router.push(`/history/${sessionId}`);
  };

  const setsLoggedForExercise = (exerciseId: string) =>
    loggedSets.filter((s) => s.exerciseId === exerciseId).length;

  const current = exercises[index];
  const isLast = index === exercises.length - 1;

  if (!sessionId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--e2)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <RestTimer />

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <span className="tabular-nums text-sm font-medium font-mono" style={{ color: "rgba(235,240,244,0.5)" }}>{formatTime(elapsed)}</span>
        <span className="text-sm font-mono" style={{ color: "rgba(235,240,244,0.4)" }}>
          {index + 1} / {exercises.length}
        </span>
        <button
          onClick={handleFinish}
          disabled={finishing}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
          style={{ background: "rgba(239,77,123,0.1)", border: "1px solid rgba(239,77,123,0.25)", color: "var(--i)" }}
        >
          {finishing ? "Saving…" : "Finish"}
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {exercises.map((ex, i) => {
          const logged = setsLoggedForExercise(ex.id);
          const done = logged >= ex.sets;
          const partial = logged > 0 && !done;
          let bg: string;
          if (i === index) bg = "var(--white)";
          else if (done) bg = "var(--e2)";
          else if (partial) bg = "var(--u)";
          else bg = "rgba(235,240,244,0.12)";
          return (
            <button
              key={ex.id}
              onClick={() => setIndex(i)}
              className="h-2 flex-1 rounded-full transition-colors"
              style={{ background: bg }}
            />
          );
        })}
      </div>

      {/* Focused exercise */}
      <ExerciseCard
        key={current.id}
        exercise={current}
        sessionId={sessionId}
        nextExerciseName={exercises[index + 1]?.primaryName}
      />

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          className="flex h-12 flex-1 items-center justify-center gap-1 rounded-xl text-sm font-semibold disabled:opacity-30 transition-colors"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "rgba(235,240,244,0.6)" }}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        {isLast ? (
          <button
            onClick={handleFinish}
            disabled={finishing}
            className="flex h-12 flex-1 items-center justify-center rounded-xl text-sm font-bold disabled:opacity-50 transition-colors"
            style={{ background: "rgba(108,188,130,0.15)", border: "1px solid rgba(108,188,130,0.3)", color: "var(--e2)" }}
          >
            {finishing ? "Saving…" : "Finish Workout"}
          </button>
        ) : (
          <button
            onClick={() => setIndex((i) => i + 1)}
            className="flex h-12 flex-1 items-center justify-center gap-1 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "rgba(235,240,244,0.6)" }}
          >
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Completed exercises summary table */}
      {loggedSets.length > 0 && (
        <div className="rounded-xl p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="mb-2 text-xs font-mono uppercase tracking-widest" style={{ color: "rgba(235,240,244,0.3)" }}>Done</p>
          <table className="w-full text-sm">
            <tbody>
              {exercises.map((ex) => {
                const count = setsLoggedForExercise(ex.id);
                if (count === 0) return null;
                const done = count >= ex.sets;
                return (
                  <tr key={ex.id} style={{ borderBottom: "1px solid rgba(235,240,244,0.06)" }} className="last:border-0">
                    <td className="py-1.5" style={{ color: "rgba(235,240,244,0.7)" }}>{ex.primaryName}</td>
                    <td className="py-1.5 text-right font-mono text-xs" style={{ color: done ? "var(--e2)" : "var(--u)" }}>{count}/{ex.sets}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
