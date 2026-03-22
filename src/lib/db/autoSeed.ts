import { prisma } from "./prisma";

export async function checkAndSeed() {
  try {
    const count = await prisma.workoutDay.count();
    if (count === 0) {
      const { main } = await import("../../../prisma/seed");
      await main();
    }
  } catch (e) {
    console.error("Auto-seed failed:", e);
  }
}
