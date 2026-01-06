import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (candidatePassword: string, passwordHash: string) => {
  return await bcrypt.compare(candidatePassword, passwordHash);
};
