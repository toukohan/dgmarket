import { describe, it, expect, beforeEach } from "vitest";

import { register } from "../../src/services/auth.service";
import { resetDb } from "../reset/db";
import { api } from "../setup/testApp";

describe("POST /api/products", () => {
    beforeEach(async () => {
        await resetDb();
    });

    it("rejects unauthenticated users", async () => {
        const res = await api.post("/api/products").send({
            name: "Destroyer",
            description: "Fast distance driver",
            priceCents: 1799,
            condition: "new",
        });

        expect(res.status).toBe(401);
    });

    it("rejects missing required fields", async () => {
        const { accessToken } = await register(
            "seller@mail.com",
            "strongpassword",
            "Seller",
        );

        const res = await api
            .post("/api/products")
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                name: "Destroyer",
                // missing priceCents + condition
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it("creates a product for an authenticated seller", async () => {
        const { accessToken } = await register(
            "seller1@mail.com",
            "strongpassword",
            "Seller",
        );

        const res = await api
            .post("/api/products")
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                name: "Destroyer",
                description: "Fast distance driver",
                priceCents: 1799,
                condition: "new",
            });

        expect(res.status).toBe(201);

        expect(res.body).toMatchObject({
            name: "Destroyer",
            description: "Fast distance driver",
            priceCents: 1799,
            condition: "new",
        });

        expect(res.body.id).toBeDefined();
        expect(res.body.createdAt).toBeDefined();
    });
});
