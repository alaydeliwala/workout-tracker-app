import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { suggestNextWeight } from "@/lib/utils/progression";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dayId = searchParams.get("dayId");

  const exercises = await prisma.exercise.findMany({
    where: dayId ? { workoutDayId: dayId } : undefined,
    orderBy: [{ workoutDayId: "asc" }, { orderIndex: "asc" }],
    include: {
      records: true,
      setLogs: {
        orderBy: { loggedAt: "desc" },
        take: 20,
        include: { session: true },
      },
    },
  });

  const enriched = exercises.map((ex) => {
    // get last session's sets
    const lastSessionId = ex.setLogs[0]?.sessionId ?? null;
    const lastSets = lastSessionId
      ? ex.setLogs.filter((s) => s.sessionId === lastSessionId)
      : [];
    const suggested = suggestNextWeight(ex, lastSets);

    return {
      ...ex,
      suggestedWeight: suggested,
      lastWeight: lastSets[0]?.weightLbs ?? null,
      personalRecord: ex.records ?? null,
    };
  });

  return NextResponse.json(enriched);
}
