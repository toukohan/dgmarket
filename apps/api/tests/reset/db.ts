import pool from "../../src/database";

export const tableSets = {
    auth: ["users", "refresh_tokens"],
};

export async function resetDb(tables: string[] = tableSets.auth) {
    await pool.query(`
    TRUNCATE TABLE ${tables.join(", ")}
    RESTART IDENTITY
    CASCADE;
  `);
}
