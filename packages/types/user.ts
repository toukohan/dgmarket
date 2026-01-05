export type UserRole = "user" | "admin" | "moderator";

export interface UserRow {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}