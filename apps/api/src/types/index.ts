import { PublicUser, UserRole } from "@dgmarket/schemas";
import { Response } from "express";

export interface UserRow {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export interface AuthenticatedResponse extends Response {
    user: PublicUser;
}
