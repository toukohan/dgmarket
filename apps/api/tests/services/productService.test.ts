import { describe, it, expect, beforeEach, afterEach } from "vitest";

import pool from "../../src/database/index.js";
import { ForbiddenError, NotFoundError } from "../../src/errors/index.js";
import { ProductRepository } from "../../src/repositories/ProductRepository.js";
import { ProductService } from "../../src/services/ProductService.js";
import { createTestSeller } from "../helpers/index.js";

import type { PoolClient } from "pg";

let client: PoolClient;
let service: ProductService;
let repo: ProductRepository;
let sellerId: number;
let otherSellerId: number;

describe("ProductService", () => {
    beforeEach(async () => {
        client = await pool.connect();
        await client.query("BEGIN");

        repo = new ProductRepository(client);
        service = new ProductService(repo);

        sellerId = await createTestSeller(client);
        otherSellerId = await createTestSeller(client);
    });

    afterEach(async () => {
        await client.query("ROLLBACK");
        client.release();
    });

    it("creates a product and returns public shape", async () => {
        const product = await service.createProduct(sellerId, {
            name: "Destroyer",
            priceCents: 1799,
            condition: "new",
        });

        expect(product.id).toBeDefined();
        expect(product.priceCents).toBe(1799);
        expect(product.createdAt).toBeTypeOf("string");
        expect((product as any).seller_id).toBeUndefined();
    });

    it("throws NotFoundError when product does not exist", async () => {
        await expect(
            service.updateProduct(999, sellerId, { name: "New name" }),
        ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("updates product when seller owns it", async () => {
        const product = await service.createProduct(sellerId, {
            name: "Destroyer",
            priceCents: 1799,
            condition: "new",
        });

        const updated = await service.updateProduct(product.id, sellerId, {
            priceCents: 1999,
        });

        expect(updated.priceCents).toBe(1999);
    });

    it("throws ForbiddenError when deleting another seller's product", async () => {
        const product = await service.createProduct(sellerId, {
            name: "Destroyer",
            priceCents: 1799,
            condition: "new",
        });

        await expect(
            service.deleteProduct(product.id, otherSellerId),
        ).rejects.toBeInstanceOf(ForbiddenError);
    });
});
