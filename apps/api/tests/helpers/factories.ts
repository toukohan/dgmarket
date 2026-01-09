import { Db } from "../../src/database/db.types.js";

export async function createTestSeller(db: Db) {
    const { rows } = await db.query<{
        id: number;
    }>(
        `
      INSERT INTO users (email, name, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
        [
            `seller-${crypto.randomUUID()}@test.com`,
            "Test Seller",
            "hashed-password",
        ],
    );

    return rows[0].id;
}

export async function createTestUser(db: Db, overrides = {}) {
    const res = await db.query(
        `INSERT INTO users (email, role, name, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [`user_${Date.now()}@test.com`, "user", "Alice Bob", "hashed_password"],
    );

    return { ...res.rows[0], ...overrides };
}
