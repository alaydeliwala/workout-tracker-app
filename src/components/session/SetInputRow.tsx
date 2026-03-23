"use client";
import { useState } from "react";
import { PRBadge } from "@/components/ui/PRBadge";

type Props = {
  setNumber: number;
  defaultWeight: number;
  repsMin: number;
  repsMax: number;
  onLog: (weight: number, reps: number) => Promise<{ isPR: boolean }>;
  isLogged: boolean;
  onDelete?: () => void;
};

export function SetInputRow({ setNumber, defaultWeight, repsMin, repsMax, onLog, isLogged, onDelete }: Props) {
  const [weight, setWeight] = useState(defaultWeight);
  const [reps, setReps] = useState(repsMax);
  const [loading, setLoading] = useState(false);
  const [pr, setPr] = useState(false);

  const adjustWeight = (delta: number) =>
    setWeight((w) => Math.max(0, Math.round((w + delta) * 10) / 10));

  const handleLog = async () => {
    setLoading(true);
    try {
      const result = await onLog(weight, reps);
      if (result.isPR) setPr(true);
    } finally {
      setLoading(false);
    }
  };

  if (isLogged) {
    return (
      <tr className="border-b border-zinc-800 last:border-0">
        <td className="py-2 text-sm text-zinc-500">{setNumber}</td>
        <td className="py-2 text-sm font-medium text-zinc-400">{weight} lbs</td>
        <td className="py-2 text-sm text-zinc-400">× {reps}</td>
        <td className="py-2 text-right">
          {pr ? <PRBadge /> : <span className="text-green-400">✓</span>}
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-zinc-800 last:border-0">
      <td className="py-2 pr-2 text-sm text-zinc-500">{setNumber}</td>

      {/* Weight */}
      <td className="py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustWeight(-2.5)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-base font-bold text-white active:bg-zinc-700"
          >
            −
          </button>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="h-9 w-14 rounded-lg bg-zinc-800 text-center text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => adjustWeight(2.5)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-base font-bold text-white active:bg-zinc-700"
          >
            +
          </button>
        </div>
      </td>

      {/* Reps */}
      <td className="py-2 pl-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setReps((r) => Math.max(1, r - 1))}
            className="flex h-9 w-8 items-center justify-center rounded-lg bg-zinc-800 text-base font-bold text-white active:bg-zinc-700"
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(parseInt(e.target.value) || 1)}
            className="h-9 w-10 rounded-lg bg-zinc-800 text-center text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setReps((r) => r + 1)}
            className="flex h-9 w-8 items-center justify-center rounded-lg bg-zinc-800 text-base font-bold text-white active:bg-zinc-700"
          >
            +
          </button>
        </div>
      </td>

      {/* Log / Delete */}
      <td className="py-2 pl-2 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-base"
              style={{ background: "rgba(239,77,123,0.1)", border: "1px solid rgba(239,77,123,0.2)", color: "var(--i)" }}
            >
              ×
            </button>
          )}
          <button
            onClick={handleLog}
            disabled={loading}
            className="h-9 rounded-xl px-4 text-sm font-bold disabled:opacity-50"
            style={{ background: "rgba(108,188,130,0.15)", border: "1px solid rgba(108,188,130,0.25)", color: "var(--e2)" }}
          >
            {loading ? "…" : "Log"}
          </button>
        </div>
      </td>
    </tr>
  );
}
