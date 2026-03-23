"use client";
import { useEffect } from "react";
import { useTimerStore } from "@/lib/stores/timerStore";
import { formatTime } from "@/lib/utils/dates";

export function RestTimer() {
  const { isActive, isPaused, remaining, totalSeconds, nextExerciseName, pauseTimer, resumeTimer, skipTimer, tick } =
    useTimerStore();

  useEffect(() => {
    if (!isActive || isPaused) return;
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [isActive, isPaused, tick]);

  if (!isActive) return null;

  const pct = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const circumference = 2 * Math.PI * 88;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-sm">
      <p className="mb-6 text-sm font-medium uppercase tracking-widest text-zinc-400">Rest</p>

      <div className="relative flex items-center justify-center">
        <svg width="220" height="220" className="-rotate-90">
          <circle cx="110" cy="110" r="88" fill="none" stroke="#27272a" strokeWidth="10" />
          <circle
            cx="110" cy="110" r="88" fill="none" stroke="#3b82f6" strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute text-5xl font-bold tabular-nums text-white">
          {formatTime(remaining)}
        </span>
      </div>

      {nextExerciseName && (
        <p className="mt-6 text-sm text-zinc-400">
          Next: <span className="font-medium text-zinc-200">{nextExerciseName}</span>
        </p>
      )}

      <div className="mt-8 flex gap-3">
        <button
          onClick={isPaused ? resumeTimer : pauseTimer}
          className="flex h-12 w-28 items-center justify-center rounded-xl bg-zinc-700 text-sm font-semibold text-white hover:bg-zinc-600"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={skipTimer}
          className="flex h-12 w-28 items-center justify-center rounded-xl bg-zinc-800 text-sm font-semibold text-zinc-300 hover:bg-zinc-700"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
