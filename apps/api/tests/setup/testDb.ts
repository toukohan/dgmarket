import { beforeAll, afterAll } from "vitest";

import pool from "../../src/database";
import { resetDb } from "../reset/db";

beforeAll(async () => {
    await pool.query("SELECT 1");
    await resetDb();
    console.log("testDb before all, select 1");
});

afterAll(async () => {
    await pool.end(); // always close pool;
    console.log("testDb after all, pool end");
});
