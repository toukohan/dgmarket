import pool from "../../src/database";

export async function createTestUser(overrides = {}) {
  const res = await pool.query(
    `INSERT INTO users (email, role, name, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [`user_${Date.now()}@test.com`, "user", "Alice Bob", "hashed_password"],
  );

  return { ...res.rows[0], ...overrides };
}
