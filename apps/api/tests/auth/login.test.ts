import { describe, it, expect, beforeAll } from "vitest";

import { resetDb } from "../reset/db";
import { api } from "../setup/testApp";

describe.sequential("POST /api/auth/login", () => {
    beforeAll(async () => {
        await resetDb();
        const res = await api.post("/api/auth/register").send({
            name: "Alice Bob",
            email: "alice.bob@mail.com",
            password: "smashing",
        });
    });

    it("valid request returns user and tokens", async () => {
        const res = await api.post("/api/auth/login").send({
            email: "alice.bob@mail.com",
            password: "smashing",
        });
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies[0].startsWith("access")).toBe(true);
        expect(cookies[1].startsWith("refresh")).toBe(true);
        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
    });

    it("returns 401 if email is not found", async () => {
        const res = await api.post("/api/auth/login").send({
            email: "john@mail.com",
            password: "supersecret",
        });
        expect(res.status).toBe(401);
    });

    it("returns 401 if password is not a match", async () => {
        const res = await api.post("/api/auth/login").send({
            email: "alice.bob@mail.com",
            password: "wrongpassword",
        });
        expect(res.status).toBe(401);
    });

    it("returns 400 if email is not a valid email", async () => {
        const res = await api.post("/api/auth/login").send({
            email: "alice",
            password: "smashing",
        });
        expect(res.status).toBe(400);
    });

    it("returns 400 if no password is sent", async () => {
        const res = await api.post("/api/auth/login").send({
            email: "john@mail.com",
            password: "",
        });
        expect(res.status).toBe(400);
    });
});
