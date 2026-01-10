import { PoolClient } from "pg";
import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";

import { createTestApp } from "./testApp.js";
import pool from "../../src/database/index.js";
import { resetTestData } from "../helpers/index.js";

let client: PoolClient;
let api: ReturnType<typeof createTestApp>;

beforeAll(async () => {
    await resetTestData();
    // console.log("BEFORE ALL DATABASE", process.env.POSTGRES_DB);
});
beforeEach(async () => {
    // console.log("BEFORE EACH DATABASE", process.env.POSTGRES_DB);
    client = await pool.connect();
    api = createTestApp(client);
    client.query("BEGIN");
});

afterEach(async () => {
    await client.query("ROLLBACK");
    client.release();
});

afterAll(async () => {
    await pool.end(); // always close pool;
});

export function getTestApi() {
    return api;
}

export function getDbClient() {
    return client;
}
