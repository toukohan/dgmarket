import { beforeAll, afterAll } from "vitest";

import pool, { runMigrations } from "../../src/database";


beforeAll(async () => {
    await runMigrations();
    console.log("testDb before all, run migrations");
});

afterAll(async () => {
    await pool.end(); // always close pool;
    console.log("testDb after all, pool end");
});
