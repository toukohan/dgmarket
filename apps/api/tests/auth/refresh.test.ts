import { describe, it, expect } from "vitest";

import { hashToken } from "@/utils/hashing";
import { generateRefreshToken } from "@/utils/jwt";

import { createTestUser } from "../factories/user.factory";
import { extractJwtCookies } from "../helpers";
import { getTestApi as api, getDbClient } from "../setup/testDb";

describe.sequential("POST /api/auth/refresh", () => {
    it.sequential("returns 401 if no refresh token cookie", async () => {
        const res = await api().post("/api/auth/refresh");

        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
    });

    it.sequential(
        "returns 403 if refresh token cookie is does not verify",
        async () => {
            const res = await api()
                .post("/api/auth/refresh")
                .set("Cookie", "refreshToken=invalid");

            expect(res.status).toBe(403);
            expect(res.body.error.message).toBe(
                "Refresh token invalid or expired",
            );
        },
    );

    it.sequential("returns 401 if refresh token is expired", async () => {
        const db = getDbClient();
        const user = await createTestUser(db);

        const refreshToken = generateRefreshToken(user.id);

        await db.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
            [user.id, hashToken(refreshToken), new Date(Date.now() - 1000)],
        );

        const res = await api()
            .post("/api/auth/refresh")
            .set("Cookie", `refreshToken=${refreshToken}`);

        expect(res.status).toBe(401);
    });

    it.sequential("returns new tokens if refresh token is valid", async () => {
        const registerResponse = await api().post("/api/auth/register").send({
            email: "alice.tokens@mail.com",
            password: "nicepassword",
            name: "Alice",
        });

        const { accessToken, refreshToken } =
            extractJwtCookies(registerResponse);

        const res = await api()
            .post("/api/auth/refresh")
            .set("Cookie", [
                `refreshToken=${refreshToken}`,
                `accessToken=${accessToken}`,
            ]);

        const { accessToken: newAccess, refreshToken: newRefresh } =
            extractJwtCookies(res);

        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();

        expect(newRefresh).toBeDefined();
        expect(newAccess).toBeDefined();

        expect(newAccess).not.toBe(accessToken);
        expect(newRefresh).not.toBe(refreshToken);
    });
});
