import { describe, it, expect } from "vitest";

import { extractJwtCookies } from "../helpers/index.js";
import { getTestApi as api } from "../setup/testDb.js";

describe.sequential("POST /api/products", () => {
    it.sequential("rejects unauthenticated users", async () => {
        const res = await api().post("/api/products").send({
            name: "Destroyer",
            description: "Fast distance driver",
            priceCents: 1799,
            condition: "new",
        });

        expect(res.status).toBe(401);
    });

    it.sequential("rejects missing required fields", async () => {
        const registerRes = await api().post("/api/auth/register").send({
            name: "Simon Seller",
            email: "seller@mail.com",
            password: "strongish",
        });

        const { accessToken } = extractJwtCookies(registerRes);

        const res = await api()
            .post("/api/products")
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                name: "Destroyer",
                // missing priceCents + condition
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it.sequential("creates a product for an authenticated seller", async () => {
        const registerReq = await api().post("/api/auth/register").send({
            name: "Simon Seller",
            email: "seller@mail.com",
            password: "strongish",
        });

        const { accessToken } = extractJwtCookies(registerReq);

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
});
