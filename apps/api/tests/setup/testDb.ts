import { PoolClient } from "pg";
import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";

import pool, { runMigrations } from "@/database";

import { createTestApp } from "./testApp";
import { resetDb } from "../helpers";

let client: PoolClient;
let api: ReturnType<typeof createTestApp>;

beforeAll(async () => {
    await runMigrations();
    await resetDb();
});

afterAll(async () => {
    await pool.end(); // always close pool;
});

beforeEach(async () => {
    client = await pool.connect();
    api = createTestApp(client);
    client.query("BEGIN");
});

afterEach(async () => {
    await client.query("ROLLBACK");
    client.release();
});

export function getTestApi() {
    return api;
}

export function getDbClient() {
    return client;
}
