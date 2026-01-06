import { RefreshToken } from "@/types/auth";

import { DatabaseError } from "../../../../packages/api-client/errors";
import pool from "../database";
import { hashToken } from "../utils/hashing";

function mapRefreshToken(row: any): RefreshToken {
    return {
        id: row.id,
        userId: row.user_id,
        tokenHash: row.token_hash,
        userAgent: row.user_agent,
        ipAddress: row.ip_address,
        createdAt: new Date(row.created_at),
        expiresAt: new Date(row.expires_at),
        revokedAt: row.revoked_at ? new Date(row.revoked_at) : null,
    };
}

export async function createRefreshToken(
    userId: number,
    token: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string,
) {
    const tokenHash = hashToken(token);
    try {
        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5)`,
            [userId, tokenHash, expiresAt, userAgent, ipAddress],
        );
    } catch (err) {
        console.error(err);
        throw new DatabaseError("create refresh failed");
    }
}

export async function findRefreshToken(
    token: string,
): Promise<RefreshToken | undefined> {
    const tokenHash = hashToken(token);
    const { rows } = await pool.query(
        `SELECT * FROM refresh_tokens WHERE token_hash = $1`,
        [tokenHash],
    );
    if (rows.length > 0) {
        return mapRefreshToken(rows[0]);
    }
    return undefined;
}

export async function getRefreshTokenDatabaseValues(
    token: string,
): Promise<RefreshToken | undefined> {
    const tokenHash = hashToken(token);
    const { rows } = await pool.query(
        `SELECT * FROM refresh_tokens WHERE token_hash = $1`,
        [tokenHash],
    );
    return rows[0];
}

export async function revokeRefreshToken(token: string) {
    const tokenHash = hashToken(token);
    await pool.query(
        `UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1`,
        [tokenHash],
    );
}
