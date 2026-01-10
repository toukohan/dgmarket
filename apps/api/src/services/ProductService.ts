import { ProductCreate, ProductUpdate, ProductPublic } from "@dgmarket/schemas";

import { NotFoundError, ForbiddenError } from "../errors/index.js";
import {
    ProductRepository,
    ProductRow,
} from "../repositories/ProductRepository.js";

export class ProductService {
    constructor(private products: ProductRepository) {}

    /* ------------------------------------------------------------------
     * Public API
     * ------------------------------------------------------------------ */

    async createProduct(
        sellerId: number,
        input: ProductCreate,
    ): Promise<ProductPublic> {
        const row = await this.products.create({
            sellerId,
            name: input.name,
            description: input.description,
            priceCents: input.priceCents,
            condition: input.condition,
        });

        return this.mapRowToPublic(row);
    }

    async getSellerProducts(sellerId: number): Promise<ProductPublic[]> {
        const rows = await this.products.findBySeller(sellerId);
        return rows.map((row) => this.mapRowToPublic(row));
    }

    async getPublicProducts(): Promise<ProductPublic[]> {
        const rows = await this.products.findPublic();
        return rows.map((row) => this.mapRowToPublic(row));
    }

    async updateProduct(
        productId: number,
        sellerId: number,
        input: ProductUpdate,
    ): Promise<ProductPublic> {
        const existing = await this.products.findById(productId);

        if (!existing) {
            throw new NotFoundError("Product not found");
        }

        if (existing.seller_id !== sellerId) {
            throw new ForbiddenError("You do not own this product");
        }

        const updated = await this.products.update({
            productId,
            name: input.name,
            description: input.description,
            priceCents: input.priceCents,
            condition: input.condition,
        });

        // This should never happen, but keeps TypeScript honest
        if (!updated) {
            throw new NotFoundError("Product not found");
        }

        return this.mapRowToPublic(updated);
    }

    async updateProductImage(
        productId: number,
        sellerId: number,
        imageUrl: string,
    ): Promise<void> {
        const existing = await this.products.findById(productId);

        if (!existing) {
            throw new NotFoundError("Product not found");
        }

        if (existing.seller_id !== sellerId) {
            throw new ForbiddenError("You do not own this product");
        }

        const updated = await this.products.updateImage(productId, imageUrl);

        if (!updated) {
            throw new NotFoundError("Product not found");
        }
    }

    async deleteProduct(productId: number, sellerId: number): Promise<void> {
        const existing = await this.products.findById(productId);

        if (!existing) {
            throw new NotFoundError("Product not found");
        }

        if (existing.seller_id !== sellerId) {
            throw new ForbiddenError("You do not own this product");
        }

        await this.products.delete(productId);
    }

    /* ------------------------------------------------------------------
     * Private helpers
     * ------------------------------------------------------------------ */

    private mapRowToPublic(row: ProductRow): ProductPublic {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            priceCents: row.price_cents,
            condition: row.condition,
            imageUrl: row.image_url,
            imageUpdatedAt: row.image_updated_at
                ? row.image_updated_at.toISOString()
                : null,
            createdAt: row.created_at.toISOString(),
            updatedAt: row.updated_at.toISOString(),
        };
    }
}
