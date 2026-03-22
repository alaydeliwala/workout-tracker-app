import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const sessions = await prisma.session.findMany({
    orderBy: { startedAt: "desc" },
    take: 50,
    include: {
      workoutDay: true,
      setLogs: { include: { exercise: true } },
    },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: Request) {
  const { workoutDayId } = await req.json();
  const session = await prisma.session.create({
    data: { workoutDayId },
    include: { workoutDay: true },
  });
  return NextResponse.json(session, { status: 201 });
}
