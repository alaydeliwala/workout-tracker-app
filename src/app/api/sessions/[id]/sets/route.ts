import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = await params;
  const { exerciseId, setNumber, reps, weightLbs, usedAlternate } = await req.json();

  const setLog = await prisma.setLog.create({
    data: { sessionId, exerciseId, setNumber, reps, weightLbs, usedAlternate: usedAlternate ?? false },
    include: { exercise: true },
  });

  // update personal record if this is heavier
  const existing = await prisma.personalRecord.findUnique({ where: { exerciseId } });
  let isPR = false;

  const oneRepMax = weightLbs * (1 + reps / 30); // Epley formula for comparison
  const existingORM = existing ? existing.weightLbs * (1 + existing.reps / 30) : 0;

  if (oneRepMax > existingORM) {
    await prisma.personalRecord.upsert({
      where: { exerciseId },
      update: { weightLbs, reps, achievedAt: new Date() },
      create: { exerciseId, weightLbs, reps, achievedAt: new Date() },
    });
    isPR = true;
  }

  return NextResponse.json({ ...setLog, isPR }, { status: 201 });
}
