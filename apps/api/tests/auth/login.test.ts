import { describe, it, expect } from "vitest";

import { getTestApi } from "../setup/testDb";

describe.only("POST /api/auth/login", () => {
    it.sequential("valid request returns user and tokens", async () => {
        await getTestApi().post("/api/auth/register").send({
            name: "Alice Registered",
            email: "alice.registered@mail.com",
            password: "alicespassword",
        });
        const res = await getTestApi().post("/api/auth/login").send({
            email: "alice.registered@mail.com",
            password: "alicespassword",
        });
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies[0].startsWith("access")).toBe(true);
        expect(cookies[1].startsWith("refresh")).toBe(true);
        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
    });

    it.sequential("returns 401 if email is not found", async () => {
        const res = await getTestApi().post("/api/auth/login").send({
            email: "bob.missing@mail.com",
            password: "supersecret",
        });
        expect(res.status).toBe(401);
    });

    it.sequential("returns 401 if password is not a match", async () => {
        await getTestApi().post("/api/auth/register").send({
            name: "Alice Registered",
            email: "alice.registered@mail.com",
            password: "alicespassword",
        });
        const res = await getTestApi().post("/api/auth/login").send({
            email: "alice.registered@mail.com",
            password: "wrongpassword",
        });
        expect(res.status).toBe(401);
    });

    it.sequential("returns 400 if email is not a valid email", async () => {
        const res = await getTestApi().post("/api/auth/login").send({
            email: "alice",
            password: "alicespassword",
        });
        expect(res.status).toBe(400);
    });

    it.sequential("returns 400 if no password is sent", async () => {
        const res = await getTestApi().post("/api/auth/login").send({
            email: "john@mail.com",
            password: "",
        });
        expect(res.status).toBe(400);
    });
});
