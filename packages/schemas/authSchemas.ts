import { z } from "zod";

export const registerSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

// Inferred types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
