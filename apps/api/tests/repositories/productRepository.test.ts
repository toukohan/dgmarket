import { PoolClient } from "pg";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import pool, { Db } from "@/database";
import { ProductRepository } from "@/repositories/ProductRepository";

import { resetDb } from "../helpers";

async function createTestSeller(db: Db) {
    const { rows } = await db.query<{
        id: number;
    }>(
        `
      INSERT INTO users (email, name, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
        [
            `seller-${crypto.randomUUID()}@test.com`,
            "Test Seller",
            "hashed-password",
        ],
    );

    return rows[0].id;
}
describe("ProductRepository", () => {
    let repo: ProductRepository;
    let client: PoolClient;
    beforeEach(async () => {
        client = await pool.connect();
        await client.query("BEGIN");
        repo = new ProductRepository(client);
    });

    afterEach(async () => {
        await client.query("ROLLBACK");
        client.release();
    });

    it("creates a product", async () => {
        const sellerId = await createTestSeller(client);
        const product = await repo.create({
            sellerId,
            name: "Destroyer",
            description: "Fast distance driver",
            priceCents: 1799,
            condition: "new",
        });

        expect(product.id).toBeDefined();
        expect(product.seller_id).toBe(1);
        expect(product.name).toBe("Destroyer");
        expect(product.price_cents).toBe(1799);
        expect(product.condition).toBe("new");
        expect(product.created_at).toBeInstanceOf(Date);
    });

    it("finds products by seller", async () => {
        const seller1 = await createTestSeller(client);
        const seller2 = await createTestSeller(client);
        await repo.create({
            sellerId: seller1,
            name: "Destroyer",
            priceCents: 1799,
            condition: "new",
        });

        await repo.create({
            sellerId: seller2,
            name: "Buzzz",
            priceCents: 1599,
            condition: "used",
        });

        const seller1Products = await repo.findBySeller(seller1);

        expect(seller1Products).toHaveLength(1);
        expect(seller1Products[0].name).toBe("Destroyer");
    });

    it("returns all public products", async () => {
        const seller1 = await createTestSeller(client);
        const seller2 = await createTestSeller(client);

        await repo.create({
            sellerId: seller1,
            name: "Destroyer",
            priceCents: 1799,
            condition: "new",
        });

        await repo.create({
            sellerId: seller2,
            name: "Buzzz",
            priceCents: 1599,
            condition: "used",
        });

        const products = await repo.findPublic();

        expect(products).toHaveLength(2);
        expect(products.map((p) => p.name)).toEqual(
            expect.arrayContaining(["Destroyer", "Buzzz"]),
        );
    });

    it("returns null when product does not exist", async () => {
        const product = await repo.findById(999);
        expect(product).toBeNull();
    });

    it("updates a product", async () => {
        const seller = await createTestSeller(client);

        const product = await repo.create({
            sellerId: seller,
            name: "Destroyer",
            priceCents: 1799,
            condition: "new",
        });

        const updated = await repo.update({
            productId: product.id,
            priceCents: 1999,
        });

        expect(updated).not.toBeNull();
        expect(updated!.price_cents).toBe(1999);
        expect(updated!.name).toBe("Destroyer");
    });

    it("returns null when update has no fields", async () => {
        const seller = await createTestSeller(client);
        const product = await repo.create({
            sellerId: seller,
            name: "Destroyer",
            priceCents: 1799,
            condition: "new",
        });

        const updated = await repo.update({
            productId: product.id,
        });

        expect(updated).toBeNull();
    });

    it("deletes a product", async () => {
        const seller = await createTestSeller(client);
        const product = await repo.create({
            sellerId: seller,
            name: "Destroyer",
            priceCents: 1799,
            condition: "new",
        });

        const deleted = await repo.delete(product.id);

        expect(deleted).toBe(true);

        const products = await repo.findPublic();
        expect(products).toHaveLength(0);
    });
});
