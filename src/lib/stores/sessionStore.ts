"use client";
import { create } from "zustand";

export type LoggedSet = {
  exerciseId: string;
  setNumber: number;
  weightLbs: number;
  reps: number;
  usedAlternate: boolean;
  isPR?: boolean;
};

type SessionStore = {
  sessionId: string | null;
  workoutDayId: string | null;
  loggedSets: LoggedSet[];

  startSession: (sessionId: string, workoutDayId: string) => void;
  logSet: (set: LoggedSet) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  sessionId: null,
  workoutDayId: null,
  loggedSets: [],

  startSession: (sessionId, workoutDayId) =>
    set({ sessionId, workoutDayId, loggedSets: [] }),

  logSet: (newSet) =>
    set((state) => ({ loggedSets: [...state.loggedSets, newSet] })),

  clearSession: () =>
    set({ sessionId: null, workoutDayId: null, loggedSets: [] }),
}));
