import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.setLog.update({
    where: { id },
    data: {
      reps: body.reps,
      weightLbs: body.weightLbs,
      usedAlternate: body.usedAlternate,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.setLog.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
