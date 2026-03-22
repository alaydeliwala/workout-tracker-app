"use client";
import { create } from "zustand";

type TimerStore = {
  isActive: boolean;
  isPaused: boolean;
  totalSeconds: number;
  remaining: number;
  nextExerciseName: string | null;

  startTimer: (seconds: number, nextExerciseName?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  skipTimer: () => void;
  tick: () => void;
};

export const useTimerStore = create<TimerStore>((set, get) => ({
  isActive: false,
  isPaused: false,
  totalSeconds: 0,
  remaining: 0,
  nextExerciseName: null,

  startTimer: (seconds, nextExerciseName = undefined) =>
    set({ isActive: true, isPaused: false, totalSeconds: seconds, remaining: seconds, nextExerciseName: nextExerciseName ?? null }),

  pauseTimer: () => set({ isPaused: true }),

  resumeTimer: () => set({ isPaused: false }),

  skipTimer: () => {
    set({ isActive: false, isPaused: false, remaining: 0 });
    playBeep();
  },

  tick: () => {
    const { remaining, isPaused } = get();
    if (isPaused) return;
    if (remaining <= 1) {
      set({ isActive: false, isPaused: false, remaining: 0 });
      playBeep();
    } else {
      set({ remaining: remaining - 1 });
    }
  },
}));

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // audio not available
  }
}
