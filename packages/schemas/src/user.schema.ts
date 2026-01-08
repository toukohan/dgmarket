import { z } from "zod";

export const UserRoleSchema = z.enum(["buyer", "seller", "admin"]);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const PublicUserSchema = z.object({
    id: z.number().int(),
    email: z.email(),
    name: z.string(),
    role: UserRoleSchema,
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type PublicUser = z.infer<typeof PublicUserSchema>;
