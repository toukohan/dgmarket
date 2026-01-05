import { z } from "zod";

export const discConditionSchema = z.enum(["new", "like_new", "used", "heavily_used"]);

export const createDiscSchema = z.object({
  brand: z.string().min(1, { message: "Brand is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  speed: z.number().int().min(1).max(14),
  glide: z.number().int().min(1).max(7),
  turn: z.number().min(-5).max(1),
  fade: z.number().min(0).max(5),
  weight_grams: z.number().int().min(140).max(180),
  plastic_type: z.string().min(1, { message: "Plastic type is required" }),
  condition: discConditionSchema,
  price_cents: z.number().int().positive({ message: "Price must be positive" }),
  description: z.string().optional(),
  image_urls: z.array(z.string().url()).optional().default([]),
  hidden: z.boolean().optional().default(false),
  sold: z.boolean().optional().default(false),
});

export const updateDiscSchema = createDiscSchema.partial();

export const discSearchSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  minSpeed: z.number().int().min(1).max(14).optional(),
  maxSpeed: z.number().int().min(1).max(14).optional(),
  minGlide: z.number().int().min(1).max(7).optional(),
  maxGlide: z.number().int().min(1).max(7).optional(),
  minTurn: z.number().min(-5).max(1).optional(),
  maxTurn: z.number().min(-5).max(1).optional(),
  minFade: z.number().min(0).max(5).optional(),
  maxFade: z.number().min(0).max(5).optional(),
  minWeight: z.number().int().min(140).max(180).optional(),
  maxWeight: z.number().int().min(140).max(180).optional(),
  plasticType: z.string().optional(),
  condition: discConditionSchema.optional(),
  minPrice: z.number().int().positive().optional(),
  maxPrice: z.number().int().positive().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(100).optional().default(20),
  offset: z.number().int().nonnegative().optional().default(0),
  sortBy: z.enum(["price_cents", "created_at", "brand", "model"]).optional().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateDiscInput = z.infer<typeof createDiscSchema>;
export type UpdateDiscInput = z.infer<typeof updateDiscSchema>;
export type DiscSearchInput = z.infer<typeof discSearchSchema>;
