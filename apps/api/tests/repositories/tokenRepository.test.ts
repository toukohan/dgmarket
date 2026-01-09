import { describe, it, expect, beforeEach } from "vitest";

import pool from "../../src/database/index.js";
import {
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
} from "../../src/repositories/token.repository.js";
import { hashToken } from "../../src/utils/hashing.js";
import { generateRefreshToken } from "../../src/utils/jwt.js";
import { createTestUser } from "../factories/user.factory.js";
import { resetTestData } from "../helpers/index.js";

describe.sequential("token repository", () => {
    beforeEach(async () => {
        await resetTestData();
    });
    it.sequential("stores refresh token with users id", async () => {
        const user = await createTestUser(pool);
        const refreshToken = generateRefreshToken(user.id);

        await createRefreshToken(
            user.id,
            refreshToken,
            new Date(Date.now() + 60000),
            pool,
        );

        const foundToken = await findRefreshToken(refreshToken, pool);
        if (!foundToken) throw new Error("no found token");

        expect(foundToken.userId).toBe(user.id);
        expect(foundToken.tokenHash).toBe(hashToken(refreshToken));
        expect(foundToken.expiresAt.getTime()).toBeGreaterThan(Date.now());
        expect(foundToken.revokedAt).toBe(null);

        // test revoking
        await revokeRefreshToken(refreshToken, pool);

        const revokedToken = await findRefreshToken(refreshToken, pool);
        if (!revokedToken) throw new Error("no revoked token");
        if (!revokedToken.revokedAt) throw new Error("not revoked");
        expect(revokedToken.revokedAt.getTime()).toBeLessThan(Date.now());
    });
});
