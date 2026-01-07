import { UserRow } from "@/types/src/user";

import pool from "../database";

export async function findUserByEmail(email: string): Promise<UserRow | null> {
    const { rows } = await pool.query(
        `SELECT id, email, name, role, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1`,
        [email],
    );
    return rows[0] || null;
}

export const findUserById = async (id: number): Promise<UserRow | null> => {
    const { rows } = await pool.query(
        `SELECT id, email, name, role, password_hash, created_at, updated_at
      FROM users
      WHERE id = $1`,
        [id],
    );
    return rows[0] || null;
};

export async function createUser({
    email,
    name,
    passwordHash,
}: {
    email: string;
    name: string;
    passwordHash: string;
}) {
    const { rows } = await pool.query(
        `
    INSERT INTO users (email, name, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, role, password_hash, created_at, updated_at
    `,
        [email, name, passwordHash],
    );
    return rows[0];
}
