import { z } from "zod";

import { IsoDateString } from "./common.schema";
export const UserRoleSchema = z.enum(["buyer", "seller", "admin"]);

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
