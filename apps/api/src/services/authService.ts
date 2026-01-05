import { hashPassword, comparePasswords, hashToken } from "../utils/hashing";
import { findUserByEmail, findUserById, createUser } from "../repositories/userRepository";
import { findRefreshToken, revokeRefreshToken } from "../repositories/tokenRepository";
import { EmailAlreadyExistsError, InvalidCredentialsError, InvalidTokenError, UnauthorizedError } from "@/api/errors";
import { generateAccessToken, generateAndInsertRefreshToken } from "../utils/jwt";
import { PublicUser, UserRow } from "@/types/user";
import { JwtPayload } from "jsonwebtoken";

interface AuthResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

function toPublicUser(user: UserRow): PublicUser {
  const { password_hash, ...publicData } = user;
  return publicData;
}

// create new access and refresh token and return them in an object with the user
async function generateTokensAndBundleResult(user: UserRow): Promise<AuthResult> {
  return { 
    user: toPublicUser(user), 
    accessToken: generateAccessToken({userId: user.id, role: user.role}), 
    refreshToken: await generateAndInsertRefreshToken(user.id)
  }
}

export async function register(email: string, password: string, name: string) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new EmailAlreadyExistsError();

  // hash the password before saving user
  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, name, passwordHash });
  
  return generateTokensAndBundleResult(user);
}

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new InvalidCredentialsError();

  const ok = await comparePasswords(password, user.password_hash);
  if (!ok) throw new InvalidCredentialsError();

  return generateTokensAndBundleResult(user);
}

export async function refresh(refreshToken: string, payload: JwtPayload) {
  const session = await findRefreshToken(refreshToken);
  if (!session) throw new UnauthorizedError("No stored token");
  if (session.revokedAt) throw new UnauthorizedError("Token revoked");
  if (session.expiresAt < new Date()) throw new UnauthorizedError("Token expired");
  const user = await findUserById(session.userId);

  if (!user) throw new UnauthorizedError("No matching user");
  if (user.id != payload.userId) throw new InvalidTokenError("User does not match");
  
  // revoke the previous token
  await revokeRefreshToken(refreshToken)
  return generateTokensAndBundleResult(user);
}

export async function logout(refreshToken:string) {
  await revokeRefreshToken(refreshToken)

}