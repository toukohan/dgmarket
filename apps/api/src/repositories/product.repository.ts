// apps/api/src/repositories/product.repository.ts
import { ProductCreate } from "@dgmarket/schemas";

type ProductRow = {
    id: number;
    seller_id: number;
    name: string;
    description: string | null;
    price_cents: number;
    condition: "new" | "used";
    created_at: Date;
};
// stub
export async function createProduct(
    sellerId: number,
    input: ProductCreate,
): Promise<ProductRow> {
    return {
        id: 1,
        seller_id: sellerId,
        name: input.name,
        description: input.description ?? null,
        price_cents: input.priceCents,
        condition: input.condition,
        created_at: new Date(),
    };
}
