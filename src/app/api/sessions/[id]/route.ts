import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      workoutDay: { include: { exercises: { orderBy: { orderIndex: "asc" } } } },
      setLogs: { include: { exercise: true }, orderBy: { loggedAt: "asc" } },
    },
  });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(session);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const session = await prisma.session.update({
    where: { id },
    data: { completedAt: body.completedAt ? new Date(body.completedAt) : new Date() },
  });
  return NextResponse.json(session);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Capture affected exercises before cascade removes the logs
  const affectedLogs = await prisma.setLog.findMany({
    where: { sessionId: id },
    select: { exerciseId: true },
  });
  const exerciseIds = [...new Set(affectedLogs.map((l) => l.exerciseId))];

  // Delete session — SetLogs cascade away
  await prisma.session.delete({ where: { id } });

  // Recompute PR for each affected exercise from remaining logs
  for (const exerciseId of exerciseIds) {
    const remainingLogs = await prisma.setLog.findMany({
      where: { exerciseId },
      select: { weightLbs: true, reps: true, loggedAt: true },
    });

    if (remainingLogs.length === 0) {
      await prisma.personalRecord.deleteMany({ where: { exerciseId } });
    } else {
      const best = remainingLogs.reduce((a, b) =>
        a.weightLbs * (1 + a.reps / 30) >= b.weightLbs * (1 + b.reps / 30) ? a : b
      );
      await prisma.personalRecord.upsert({
        where: { exerciseId },
        update: { weightLbs: best.weightLbs, reps: best.reps, achievedAt: best.loggedAt },
        create: { exerciseId, weightLbs: best.weightLbs, reps: best.reps, achievedAt: best.loggedAt },
      });
    }
  }

  return new NextResponse(null, { status: 204 });
}
