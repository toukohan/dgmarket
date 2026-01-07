import { z } from "zod";

export const ProductCreateSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    priceCents: z.number().int().positive(),
    condition: z.enum(["new", "used"]),
});

export type ProductCreate = z.infer<typeof ProductCreateSchema>;
