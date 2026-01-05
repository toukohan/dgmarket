import { beforeAll, afterAll } from "vitest";
import  pool from "../../src/database";

beforeAll(async () => {
  await pool.query("SELECT 1");
  console.log("testDb before all, select 1")
});

afterAll(async () => {
  await pool.end(); // always close pool;
  console.log("testDb after all, pool end")
});
