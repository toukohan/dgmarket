import { Db } from "../database/index.js";

export type ProductRow = {
    id: number;
    seller_id: number;
    name: string;
    description: string | null;
    price_cents: number;
    condition: "new" | "used";
    created_at: Date;
    updated_at: Date;
};

type CreateProductInput = {
    sellerId: number;
    name: string;
    description?: string;
    priceCents: number;
    condition: "new" | "used";
};

type UpdateProductInput = {
    productId: number;
    name?: string;
    description?: string;
    priceCents?: number;
    condition?: "new" | "used";
};

export class ProductRepository {
    constructor(private db: Db) {}

    async create(input: CreateProductInput): Promise<ProductRow> {
        const { rows } = await this.db.query<ProductRow>(
            `
      INSERT INTO products (
        seller_id,
        name,
        description,
        price_cents,
        condition
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
            [
                input.sellerId,
                input.name,
                input.description ?? null,
                input.priceCents,
                input.condition,
            ],
        );

        return rows[0];
    }

    async findBySeller(sellerId: number): Promise<ProductRow[]> {
        const { rows } = await this.db.query<ProductRow>(
            `
      SELECT *
      FROM products
      WHERE seller_id = $1
      ORDER BY created_at DESC
      `,
            [sellerId],
        );

        return rows;
    }

    async findPublic(): Promise<ProductRow[]> {
        const { rows } = await this.db.query<ProductRow>(
            `
      SELECT *
      FROM products
      ORDER BY created_at DESC
      `,
        );

        return rows;
    }

    async findById(productId: number): Promise<ProductRow | null> {
        const { rows } = await this.db.query<ProductRow>(
            `
            SELECT *
            FROM products
            WHERE id = $1
            `,
            [productId],
        );

        return rows[0] ?? null;
    }

    async update(input: UpdateProductInput): Promise<ProductRow | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        let idx = 1;

        if (input.name !== undefined) {
            fields.push(`name = $${idx++}`);
            values.push(input.name);
        }

        if (input.description !== undefined) {
            fields.push(`description = $${idx++}`);
            values.push(input.description);
        }

        if (input.priceCents !== undefined) {
            fields.push(`price_cents = $${idx++}`);
            values.push(input.priceCents);
        }

        if (input.condition !== undefined) {
            fields.push(`condition = $${idx++}`);
            values.push(input.condition);
        }

        if (fields.length === 0) {
            return null;
        }

        const { rows } = await this.db.query<ProductRow>(
            `
      UPDATE products
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *
      `,
            [...values, input.productId],
        );

        return rows[0] ?? null;
    }

    async delete(productId: number): Promise<boolean> {
        const { rowCount } = await this.db.query(
            `
      DELETE FROM products
      WHERE id = $1
      `,
            [productId],
        );

        return rowCount === 1;
    }
}
