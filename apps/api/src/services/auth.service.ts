import { PublicUser, PublicUserSchema } from "@dgmarket/schemas";
import { JwtPayload } from "jsonwebtoken";

import { Db } from "../database/index.js";
import {
    EmailAlreadyExistsError,
    InvalidCredentialsError,
    InvalidTokenError,
    UnauthorizedError,
} from "../errors/index.js";
import {
    findRefreshToken,
    revokeRefreshToken,
} from "../repositories/token.repository.js";
import {
    findUserByEmail,
    findUserById,
    createUser,
    UserRow,
} from "../repositories/user.repository.js";
import { hashPassword, comparePasswords } from "../utils/hashing.js";
import {
    generateAccessToken,
    generateAndInsertRefreshToken,
} from "../utils/jwt.js";

interface AuthResult {
    user: PublicUser;
    accessToken: string;
    refreshToken: string;
}

function toPublicUser(user: UserRow): PublicUser {
    return PublicUserSchema.parse({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
    });
}

// create new access and refresh token and return them in an object with the user
async function generateTokensAndBundleResult(
    user: UserRow,
    db: Db,
): Promise<AuthResult> {
    return {
        user: toPublicUser(user),
        accessToken: generateAccessToken({ userId: user.id, role: user.role }),
        refreshToken: await generateAndInsertRefreshToken(user.id, db),
    };
}

export async function register(
    email: string,
    password: string,
    name: string,
    db: Db,
) {
    const existingUser = await findUserByEmail(email, db);
    if (existingUser) throw new EmailAlreadyExistsError();

    // hash the password before saving user
    const passwordHash = await hashPassword(password);
    const user = await createUser(email, name, passwordHash, db);

    return generateTokensAndBundleResult(user, db);
}

export async function login(email: string, password: string, db: Db) {
    const user = await findUserByEmail(email, db);
    if (!user) throw new InvalidCredentialsError();

    const ok = await comparePasswords(password, user.password_hash);
    if (!ok) throw new InvalidCredentialsError();

    return generateTokensAndBundleResult(user, db);
}

export async function refresh(
    refreshToken: string,
    payload: JwtPayload,
    db: Db,
) {
    const session = await findRefreshToken(refreshToken, db);
    if (!session) throw new UnauthorizedError("No stored token");
    if (session.revokedAt) throw new UnauthorizedError("Token revoked");
    if (session.expiresAt < new Date())
        throw new UnauthorizedError("Token expired");
    const user = await findUserById(session.userId, db);

    if (!user) throw new UnauthorizedError("No matching user");
    if (user.id != payload.userId)
        throw new InvalidTokenError("User does not match");

    // revoke the previous token
    await revokeRefreshToken(refreshToken, db);
    return generateTokensAndBundleResult(user, db);
}

export async function logout(refreshToken: string, db: Db): Promise<boolean> {
    return await revokeRefreshToken(refreshToken, db);
}
