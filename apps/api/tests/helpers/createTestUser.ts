import { Db } from "../../src/database/index.js";

export async function createTestUser(db: Db) {
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
