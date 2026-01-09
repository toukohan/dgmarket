import pool from "../../src/database/index.js";

export const tableSets = {
    auth: ["users", "refresh_tokens"],
};

export async function resetTestData(tables: string[] = tableSets.auth) {
    if (process.env.NODE_ENV !== "test") {
        throw new Error("resetDb can only be run when NODE_ENV=test");
    }
    await pool.query(`
    TRUNCATE TABLE ${tables.join(", ")}
    RESTART IDENTITY
    CASCADE;
  `);
}
