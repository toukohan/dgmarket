import { z } from "zod";

import { IsoDateString } from "./common.schema.js";

/**
 * Shared enums
 */
export const ProductConditionSchema = z.enum(["new", "used"]);
export type ProductCondition = z.infer<typeof ProductConditionSchema>;

/**
 * Create product (seller)
 */
export const ProductCreateSchema = z.object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    priceCents: z.number().int().nonnegative(),
    condition: ProductConditionSchema,
});

export type ProductCreate = z.infer<typeof ProductCreateSchema>;

/**
 * Update product (seller)
 * - partial
 * - but must contain at least one field
 */
export const ProductUpdateSchema = ProductCreateSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field must be provided",
    },
);

export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;

/**
 * Public product shape (API response)
 */
export const ProductPublicSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string().nullable(),
    priceCents: z.number().int().nonnegative(),
    condition: ProductConditionSchema,
    imageUrl: z.string().nullable(),
    imageUpdatedAt: IsoDateString.nullable(),
    createdAt: IsoDateString,
    updatedAt: IsoDateString,
});

export type ProductPublic = z.infer<typeof ProductPublicSchema>;

/**
 * Product list response
 * (future-proof for pagination)
 */
export const ProductListSchema = z.array(ProductPublicSchema);
export type ProductList = z.infer<typeof ProductListSchema>;
