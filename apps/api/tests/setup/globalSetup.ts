import { runMigrations } from "../../src/database/migrate.js";

let migrated = false;
export default async function setup() {
    if (process.env.NODE_ENV !== "test") {
        throw new Error("Tests must run with NODE_ENV=test");
    }

    console.log("VITEST GLOBAL SETUP: migrated:", migrated); // checking if it's ran more than once
    if (!migrated) {
        await runMigrations();
        migrated = true;
    }
}
