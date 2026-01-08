import { Db } from "../database/index.js";

export interface UserRow {
    id: number;
    email: string;
    name: string;
    role: "user" | "admin" | "moderator";
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export async function findUserByEmail(
    email: string,
    db: Db,
): Promise<UserRow | null> {
    const { rows } = await db.query(
        `SELECT id, email, name, role, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1`,
        [email],
    );
    return rows[0] || null;
}

export const findUserById = async (
    id: number,
    db: Db,
): Promise<UserRow | null> => {
    const { rows } = await db.query(
        `SELECT id, email, name, role, password_hash, created_at, updated_at
      FROM users
      WHERE id = $1`,
        [id],
    );
    return rows[0] || null;
};

export async function createUser(
    email: string,
    name: string,
    passwordHash: string,
    db: Db,
) {
    const { rows } = await db.query(
        `
    INSERT INTO users (email, name, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, role, password_hash, created_at, updated_at
    `,
        [email, name, passwordHash],
    );
    return rows[0];
}
