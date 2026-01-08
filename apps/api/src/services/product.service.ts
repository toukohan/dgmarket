import { ProductCreate } from "@dgmarket/schemas";

import { createProduct as createProductRepo } from "../repositories/product.repository.js";

export type PublicProduct = {
    id: number;
    name: string;
    description?: string;
    priceCents: number;
    condition: "new" | "used";
    createdAt: string;
};

export async function createProduct(
    sellerId: number,
    input: ProductCreate,
): Promise<PublicProduct> {
    // Business rule: price sanity check (defensive)
    if (input.priceCents <= 0) {
        throw new Error("Invalid product price");
    }

    const productRow = await createProductRepo(sellerId, input);

    // Map DB row → public API shape
    return {
        id: productRow.id,
        name: productRow.name,
        description: productRow.description ?? undefined,
        priceCents: productRow.price_cents,
        condition: productRow.condition,
        createdAt: productRow.created_at.toISOString(),
    };
}
