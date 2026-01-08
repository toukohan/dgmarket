import { Db } from "../database/index.js";
import { DatabaseError } from "../errors/index.js";
import { hashToken } from "../utils/hashing.js";

interface RefreshTokenRow {
    id: number;
    user_id: number;
    token_hash: string;
    user_agent: string | null;
    ip_address: string | null;
    created_at: Date;
    expires_at: Date;
    revoked_at: Date | null;
}

interface RefreshToken {
    id: number;
    userId: number;
    tokenHash: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    createdAt: Date;
    expiresAt: Date;
    revokedAt?: Date | null;
}

function mapRefreshToken(row: RefreshTokenRow): RefreshToken {
    return {
        id: row.id,
        userId: row.user_id,
        tokenHash: row.token_hash,
        userAgent: row.user_agent,
        ipAddress: row.ip_address,
        createdAt: row.created_at,
        expiresAt: row.expires_at,
        revokedAt: row.revoked_at,
    };
}

export async function createRefreshToken(
    userId: number,
    token: string,
    expiresAt: Date,
    db: Db,
    userAgent?: string,
    ipAddress?: string,
) {
    const tokenHash = hashToken(token);
    try {
        await db.query(
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
    db: Db,
): Promise<RefreshToken | undefined> {
    const tokenHash = hashToken(token);
    const { rows } = await db.query(
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
    db: Db,
): Promise<RefreshToken | undefined> {
    const tokenHash = hashToken(token);
    const { rows } = await db.query(
        `SELECT * FROM refresh_tokens WHERE token_hash = $1`,
        [tokenHash],
    );
    return rows[0];
}

export async function revokeRefreshToken(
    token: string,
    db: Db,
): Promise<boolean> {
    const tokenHash = hashToken(token);
    const result = await db.query(
        `UPDATE refresh_tokens 
         SET revoked_at = NOW() 
         WHERE token_hash = $1
         AND revoked_at IS NULL`,
        [tokenHash],
    );

    //for testing
    return result.rowCount === 1;
}
