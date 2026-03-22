import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const records = await prisma.personalRecord.findMany({
    include: { exercise: { include: { workoutDay: true } } },
    orderBy: { achievedAt: "desc" },
  });
  return NextResponse.json(records);
}
