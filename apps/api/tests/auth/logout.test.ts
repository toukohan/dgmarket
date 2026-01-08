import { describe, it, expect } from "vitest";

import { extractJwtCookies } from "../helpers";
import { getTestApi as api } from "../setup/testDb";

// getting inconsistent results, something is wrong with the test setup
describe.sequential("POST /api/auth/logout", () => {
    it.sequential("return 204 if no refresh cookie", async () => {
        const res = await api().post("/api/auth/logout");

        expect(res.status).toBe(204);
    });

    it.sequential("revokes users refresh token", async () => {
        const firstResponse = await api().post("/api/auth/register").send({
            name: "Alice Wonder",
            email: "alice.wonder@mail.com",
            password: "youllneverguess",
        });

        const { refreshToken } = extractJwtCookies(firstResponse);

        const res = await api()
            .post("/api/auth/logout")
            .set("Cookie", `refreshToken=${refreshToken}`);

        expect(res.status).toBe(204);

        const { refreshToken: tokenAfterLogout } = extractJwtCookies(res);
        expect(tokenAfterLogout).toBe("");
    });
});
