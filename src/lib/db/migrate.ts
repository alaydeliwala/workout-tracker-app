import path from "path";
import fs from "fs";

export async function runMigrations() {
  const { default: Database } = await import("better-sqlite3");

  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const dbPath = path.resolve(url.replace(/^file:/, ""));

  const db = new Database(dbPath);

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id"                  TEXT NOT NULL PRIMARY KEY,
        "checksum"            TEXT NOT NULL,
        "finished_at"         DATETIME,
        "migration_name"      TEXT NOT NULL,
        "logs"                TEXT,
        "rolled_back_at"      DATETIME,
        "started_at"          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "applied_steps_count" INTEGER NOT NULL DEFAULT 0
      )
    `);

    const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
    if (!fs.existsSync(migrationsDir)) return;

    const dirs = fs
      .readdirSync(migrationsDir)
      .filter((n) =>
        fs.statSync(path.join(migrationsDir, n)).isDirectory()
      )
      .sort();

    for (const migrationName of dirs) {
      const sqlPath = path.join(migrationsDir, migrationName, "migration.sql");
      if (!fs.existsSync(sqlPath)) continue;

      const already = db
        .prepare(`SELECT id FROM "_prisma_migrations" WHERE migration_name = ?`)
        .get(migrationName);
      if (already) continue;

      console.log(`[migrate] applying ${migrationName}`);
      db.exec(fs.readFileSync(sqlPath, "utf-8"));

      db.prepare(
        `INSERT INTO "_prisma_migrations"
           (id, checksum, finished_at, migration_name, applied_steps_count)
         VALUES (?, '', ?, ?, 1)`
      ).run(crypto.randomUUID(), new Date().toISOString(), migrationName);
    }
  } finally {
    db.close();
  }
}
