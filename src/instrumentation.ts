export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runMigrations } = await import("./lib/db/migrate");
    try {
      await runMigrations();
    } catch (e) {
      console.error("Migration failed:", e);
    }
    const { checkAndSeed } = await import("./lib/db/autoSeed");
    await checkAndSeed();
  }
}
