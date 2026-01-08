import { describe, it, expect } from "vitest";

import { getTestApi as api } from "../setup/testDb";

describe.sequential("POST /api/auth/register", () => {
    it.sequential("valid request stores the user properly", async () => {
        const res = await api().post("/api/auth/register").send({
            name: "Bob Alice",
            email: "bob.alice@mail.com",
            password: "smashing",
        });

        expect(res.status).toBe(201);
    });

    it.sequential("returns 400 if email is not a valid email", async () => {
        const res = await api().post("/api/auth/register").send({
            name: "Alice",
            email: "alice@mail",
            password: "supersecret",
        });
        expect(res.status).toBe(400);
    });

    it.sequential("returns 400 if password is too short", async () => {
        const res = await api().post("/api/auth/register").send({
            name: "Alice",
            email: "alice@mail.com",
            password: "super",
        });
        expect(res.status).toBe(400);
    });

    it.sequential("returns 409 if email is already registered", async () => {
        await api().post("/api/auth/register").send({
            name: "Alice",
            email: "alice@mail.com",
            password: "supersecret",
        });
        const res = await api().post("/api/auth/register").send({
            name: "Alice",
            email: "alice@mail.com",
            password: "supersecret",
        });
        expect(res.status).toBe(409);
    });
});
