import { describe, it, expect } from "vitest";

import { findRefreshToken } from "../../src/repositories/token.repository";
import { register } from "../../src/services/auth.service";
import { resetDb } from "../reset/db";
import { api } from "../setup/testApp";

// getting inconsistent results, something is wrong with the test setup
describe.sequential("POST /api/auth/logout", () => {
    it("revokes users refresh token", async () => {
        await resetDb();
        const { refreshToken } = await register(
            "alice2@mail.com",
            "strongpassword",
            "alice",
        );

        const res = await api
            .post("/api/auth/logout")
            .set("Cookie", `refreshToken=${refreshToken}`);

        const token = await findRefreshToken(refreshToken);

        expect(res.status).toBe(204);
        expect(token).toBeDefined();
        expect(token.revokedAt).toBeTruthy();
    });
});
