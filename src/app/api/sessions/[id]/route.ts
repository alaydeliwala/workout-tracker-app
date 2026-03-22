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
  await prisma.session.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
