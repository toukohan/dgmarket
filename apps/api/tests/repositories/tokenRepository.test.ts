import { describe, it, expect } from "vitest";

import {
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
} from "../../src/repositories/tokenRepository";
import { hashToken } from "../../src/utils/hashing";
import { generateRefreshToken } from "../../src/utils/jwt";
import { createTestUser } from "../factories/user.factory";
import "../setup/transaction";
import { resetDb } from "../reset/db";

describe.sequential("token repository", () => {
    it("stores refresh token with users id", async () => {
        await resetDb();
        const user = await createTestUser();
        const refreshToken = generateRefreshToken(user.id);

        await createRefreshToken(
            user.id,
            refreshToken,
            new Date(Date.now() + 60000),
        );

        const foundToken = await findRefreshToken(refreshToken);

        expect(foundToken.userId).toBe(user.id);
        expect(foundToken.tokenHash).toBe(hashToken(refreshToken));
        expect(foundToken.expiresAt.getTime()).toBeGreaterThan(Date.now());
        expect(foundToken.revokedAt).toBe(null);

        // test revoking
        await revokeRefreshToken(refreshToken);

        const revokedToken = await findRefreshToken(refreshToken);
        expect(revokedToken.revokedAt.getTime()).toBeLessThan(Date.now());
        await resetDb();
    });
});
