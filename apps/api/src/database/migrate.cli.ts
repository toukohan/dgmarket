import { runMigrations } from "./migrate";
import { pool } from "./pool";

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
