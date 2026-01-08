import { PoolClient } from "pg";
import { describe, it, expect, beforeEach } from "vitest";

import {
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
} from "../../src/repositories/token.repository";
import { hashToken } from "../../src/utils/hashing";
import { generateRefreshToken } from "../../src/utils/jwt";
import { createTestUser } from "../factories/user.factory";
import { getDbClient } from "../setup/testDb";

let db: PoolClient;
describe.sequential("token repository", () => {
    beforeEach(() => {
        db = getDbClient();
    });
    it.sequential("stores refresh token with users id", async () => {
        const user = await createTestUser(db);
        const refreshToken = generateRefreshToken(user.id);

        await createRefreshToken(
            user.id,
            refreshToken,
            new Date(Date.now() + 60000),
            db,
        );

        const foundToken = await findRefreshToken(refreshToken, db);
        if (!foundToken) throw new Error("no found token");

        expect(foundToken.userId).toBe(user.id);
        expect(foundToken.tokenHash).toBe(hashToken(refreshToken));
        expect(foundToken.expiresAt.getTime()).toBeGreaterThan(Date.now());
        expect(foundToken.revokedAt).toBe(null);

        // test revoking
        await revokeRefreshToken(refreshToken, db);

        const revokedToken = await findRefreshToken(refreshToken, db);
        if (!revokedToken) throw new Error("no revoked token");
        if (!revokedToken.revokedAt) throw new Error("not revoked");
        expect(revokedToken.revokedAt.getTime()).toBeLessThan(Date.now());
    });
});
