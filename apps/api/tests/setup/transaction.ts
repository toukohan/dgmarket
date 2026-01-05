import { beforeEach, afterEach } from "vitest"
import pool from "../../src/database"

beforeEach(async () => {
    await pool.query("BEGIN");
    console.log("transaction before each, BEGIN")
})

afterEach(async () => {
    await pool.query("ROLLBACK")
    console.log("transaction after each, ROLLBACK")
})