import { describe, it, expect } from "vitest";

import { extractJwtCookies } from "../helpers/index.js";
import { getTestApi as api } from "../setup/testDb.js";

describe.sequential("Products API", () => {
    async function registerSeller(email: string) {
        const res = await api().post("/api/auth/register").send({
            name: "Simon Seller",
            email,
            password: "strongish",
        });

        return extractJwtCookies(res).accessToken;
    }

    it.sequential(
        "POST /api/products rejects unauthenticated users",
        async () => {
            const res = await api().post("/api/products").send({
                name: "Destroyer",
                priceCents: 1799,
                condition: "new",
            });

            expect(res.status).toBe(401);
        },
    );

    it.sequential(
        "POST /api/products rejects missing required fields",
        async () => {
            const accessToken = await registerSeller(
                `seller-${Date.now()}@mail.com`,
            );

            const res = await api()
                .post("/api/products")
                .set("Cookie", `accessToken=${accessToken}`)
                .send({
                    name: "Destroyer",
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
        },
    );

    it.sequential("POST /api/products creates a product", async () => {
        const accessToken = await registerSeller(
            `seller-${Date.now()}@mail.com`,
        );

        const res = await api()
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

    it.sequential("GET /api/products returns public products", async () => {
        const accessToken = await registerSeller(
            `seller-${Date.now()}@mail.com`,
        );

        await api()
            .post("/api/products")
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                name: "Buzzz",
                priceCents: 1599,
                condition: "used",
            });

        const res = await api().get("/api/products");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("name");
    });

    it.sequential(
        "GET /api/products/mine returns only seller products",
        async () => {
            const accessToken = await registerSeller(
                `seller-${Date.now()}@mail.com`,
            );

            await api()
                .post("/api/products")
                .set("Cookie", `accessToken=${accessToken}`)
                .send({
                    name: "Destroyer",
                    priceCents: 1799,
                    condition: "new",
                });

            const res = await api()
                .get("/api/products/mine")
                .set("Cookie", `accessToken=${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].name).toBe("Destroyer");
        },
    );

    it.sequential("PATCH /api/products/:id updates a product", async () => {
        const accessToken = await registerSeller(
            `seller-${Date.now()}@mail.com`,
        );

        const createRes = await api()
            .post("/api/products")
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                name: "Destroyer",
                priceCents: 1799,
                condition: "new",
            });

        const productId = createRes.body.id;

        const updateRes = await api()
            .patch(`/api/products/${productId}`)
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                priceCents: 1999,
            });

        expect(updateRes.status).toBe(200);
        expect(updateRes.body.priceCents).toBe(1999);
    });

    it.sequential("DELETE /api/products/:id deletes a product", async () => {
        const accessToken = await registerSeller(
            `seller-${Date.now()}@mail.com`,
        );

        const createRes = await api()
            .post("/api/products")
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                name: "Destroyer",
                priceCents: 1799,
                condition: "new",
            });

        const productId = createRes.body.id;

        const deleteRes = await api()
            .delete(`/api/products/${productId}`)
            .set("Cookie", `accessToken=${accessToken}`);

        expect(deleteRes.status).toBe(204);

        const listRes = await api().get("/api/products");
        expect(listRes.body.find((p: any) => p.id === productId)).toBeFalsy();
    });
});
