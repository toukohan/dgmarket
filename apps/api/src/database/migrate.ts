import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool } from "./pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, "migrations");

export async function runMigrations() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      run_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

    const files = fs
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith(".sql"))
        .sort();

    const { rows } = await pool.query("SELECT name FROM migrations");
    const ran = new Set(rows.map((r) => r.name));

    for (const file of files) {
        if (ran.has(file)) continue;

        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

        console.log(`Running migration: ${file}`);
        await pool.query("BEGIN");
        try {
            await pool.query(sql);
            await pool.query("INSERT INTO migrations (name) VALUES ($1)", [
                file,
            ]);
            await pool.query("COMMIT");
        } catch (err) {
            await pool.query("ROLLBACK");
            throw err;
        }
    }
}
