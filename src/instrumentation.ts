export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { checkAndSeed } = await import("./lib/db/autoSeed");
    await checkAndSeed();
  }
}
