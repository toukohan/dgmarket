import { runMigrations } from "./migrate.js";
import { pool } from "./pool.js";

async function main() {
    try {
        console.log("Running database migrations...");
        await runMigrations();
        console.log("Migrations completed successfully");
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
