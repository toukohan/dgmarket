import { z } from "zod";

import { IsoDateString } from "./common.schema.js";
export const UserRoleSchema = z.enum(["user", "moderator", "admin"]);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const PublicUserSchema = z.object({
    id: z.number().int(),
    email: z.email(),
    name: z.string(),
    role: UserRoleSchema,
    created_at: IsoDateString,
    updated_at: IsoDateString,
});

export type PublicUser = z.infer<typeof PublicUserSchema>;
