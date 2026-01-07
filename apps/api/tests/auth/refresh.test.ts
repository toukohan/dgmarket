import { beforeEach, describe, it, expect } from "vitest";

import pool from "../../src/database";
import { createRefreshToken } from "../../src/repositories/token.repository";
import { register } from "../../src/services/auth.service";
import { hashToken } from "../../src/utils/hashing";
import {
    generateRefreshToken,
    generateAndInsertRefreshToken,
} from "../../src/utils/jwt";
import { createTestUser } from "../factories/user.factory";
import { resetDb } from "../reset/db";
import { api } from "../setup/testApp";

describe.sequential("POST /api/auth/refresh", () => {
    beforeEach(async () => {
        await resetDb();
    });

    it("returns 401 if no refresh token cookie", async () => {
        const res = await api.post("/api/auth/refresh");

        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
    });

    it("returns 403 if refresh token cookie is does not verify", async () => {
        const res = await api
            .post("/api/auth/refresh")
            .set("Cookie", "refreshToken=invalid");

        expect(res.status).toBe(403);
        expect(res.body.error.message).toBe("Refresh token invalid or expired");
    });

    it("returns 401 if refresh token is expired", async () => {
        const user = await createTestUser();

        const refreshToken = generateRefreshToken(user.id);

        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
            [user.id, hashToken(refreshToken), new Date(Date.now() - 1000)],
        );

        const res = await api
            .post("/api/auth/refresh")
            .set("Cookie", `refreshToken=${refreshToken}`);

        expect(res.status).toBe(401);
    });

    it("returns new refresh token if refresh token is valid", async () => {
        const { accessToken, refreshToken } = await register(
            "alice.tokens@mail.com",
            "nicepassword",
            "Alice",
        );

        const res = await api
            .post("/api/auth/refresh")
            .set("Cookie", [
                `refreshToken=${refreshToken}`,
                `accessToken=${accessToken}`,
            ]);

        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();

        const setCookieHeader = res.headers["set-cookie"];
        expect(setCookieHeader).toBeDefined();

        const setCookies = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

        expect(setCookies).toBeDefined();

        // Find the new access token cookie
        const newRefreshTokenCookie = setCookies.find((cookie: string) =>
            cookie.startsWith("refreshToken="),
        );

        expect(newRefreshTokenCookie).toBeDefined();

        const newRefreshToken = newRefreshTokenCookie!
            .split(";")[0]
            .replace("refreshToken=", "");

        // ✅ Assert token rotation
        expect(newRefreshToken).not.toBe(refreshToken);
    });
});
