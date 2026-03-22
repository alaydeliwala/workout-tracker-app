import { PrismaClient } from "../src/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { upperDayExercises } from "./data/upperDay";
import { lowerDayExercises } from "./data/lowerDay";
import { warmupExercises, resetExercises } from "./data/routines";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter } as any);

export async function main() {
  const workoutDays = [
    { id: "upper", name: "Upper Day" },
    { id: "lower", name: "Lower Day" },
    { id: "warmup", name: "Warm-Up" },
    { id: "reset", name: "Daily Reset" },
  ];

  for (const day of workoutDays) {
    await prisma.workoutDay.upsert({
      where: { id: day.id },
      update: { name: day.name },
      create: day,
    });
  }

  const exerciseGroups = [
    { dayId: "upper", exercises: upperDayExercises },
    { dayId: "lower", exercises: lowerDayExercises },
    { dayId: "warmup", exercises: warmupExercises },
    { dayId: "reset", exercises: resetExercises },
  ];

  for (const group of exerciseGroups) {
    for (const ex of group.exercises) {
      const existing = await prisma.exercise.findFirst({
        where: { workoutDayId: group.dayId, orderIndex: ex.orderIndex },
      });

      if (existing) {
        await prisma.exercise.update({
          where: { id: existing.id },
          data: { ...ex, workoutDayId: group.dayId },
        });
      } else {
        await prisma.exercise.create({
          data: { ...ex, workoutDayId: group.dayId },
        });
      }
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
