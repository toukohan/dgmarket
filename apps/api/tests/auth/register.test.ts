import { describe, it, expect, beforeEach } from "vitest";

import { findUserByEmail } from "../../src/repositories/user.repository";
import { comparePasswords } from "../../src/utils/hashing";
import { resetDb } from "../reset/db";
import { api } from "../setup/testApp";

describe.sequential("POST /api/auth/register", () => {
    beforeEach(async () => {
        await resetDb();
    });
    it("valid request stores the user properly", async () => {
        const res = await api.post("/api/auth/register").send({
            name: "Bob Alice",
            email: "bob.alice@mail.com",
            password: "smashing",
        });
        const user = await findUserByEmail("bob.alice@mail.com");

        expect(user).not.toBeNull()
        if (!user) {
            throw new Error("User is null")
        }
        expect(user.password_hash).toBeDefined()
        const passwordMatch = await comparePasswords(
            "smashing",
            user.password_hash,
        );
        expect(res.status).toBe(201);
        expect(res.body.user).toBeDefined();
        expect(user.name).toBe("Bob Alice");
        expect(passwordMatch).toBe(true);
    });

    it("returns 400 if email is not a valid email", async () => {
        const res = await api.post("/api/auth/register").send({
            name: "Alice",
            email: "alice@mail",
            password: "supersecret",
        });
        expect(res.status).toBe(400);
    });

    it("returns 400 if password is too short", async () => {
        const res = await api.post("/api/auth/register").send({
            name: "Alice",
            email: "alice@mail.com",
            password: "super",
        });
        expect(res.status).toBe(400);
    });

    it("returns 409 if email is already registered", async () => {
        await api.post("/api/auth/register").send({
            name: "Alice",
            email: "alice@mail.com",
            password: "supersecret",
        });
        const res = await api.post("/api/auth/register").send({
            name: "Alice",
            email: "alice@mail.com",
            password: "supersecret",
        });
        expect(res.status).toBe(409);
    });
});
