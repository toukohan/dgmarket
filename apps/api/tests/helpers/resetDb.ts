import pool from "../../src/database/index.js";

export const tableSets = {
    auth: ["users", "refresh_tokens"],
};

export async function resetDb(tables: string[] = tableSets.auth) {
    if (
        process.env.POSTGRES_DB !== "dgm_test" &&
        process.env.POSTGRES_DB !== "test_db"
    ) {
        throw new Error(
            `resetDb can only run against test database ${process.env.POSTGRES_DB}`,
        );
    }
    await pool.query(`
    TRUNCATE TABLE ${tables.join(", ")}
    RESTART IDENTITY
    CASCADE;
  `);
}
