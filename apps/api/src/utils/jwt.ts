import { Response } from "express";
import fs from "fs";
import jwt, { JwtPayload } from "jsonwebtoken";
import path from "path";

import { UserRole } from "@/types/src/user";

import { createRefreshToken } from "../repositories/token.repository";

export interface AccessTokenPayload {
    userId: number;
    role: UserRole;
}

const ACCESS_TOKEN_EXP = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXP = 7 * 24 * 60 * 60; // 7 days in seconds
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

function loadKey(envName: string) {
    const p = process.env[envName];
    if (!p) throw new Error(`${envName} is not set`);
    const joined = path.join(process.cwd(), p);
    return fs.readFileSync(joined, "utf8");
}

// Private keys for signing
const privateAccessKey = loadKey("ACCESS_PRIVATE_KEY_PATH");
const privateRefreshKey = loadKey("REFRESH_PRIVATE_KEY_PATH");

// Public keys for verification
const publicAccessKey = loadKey("ACCESS_PUBLIC_KEY_PATH");
const publicRefreshKey = loadKey("REFRESH_PUBLIC_KEY_PATH");

export const generateAccessToken = (payload: AccessTokenPayload) =>
    jwt.sign(payload, privateAccessKey, {
        algorithm: "RS256",
        expiresIn: ACCESS_TOKEN_EXP,
    });

export const generateRefreshToken = (userId: number) => {
    // seems that tests generate tokens within the same second so token wont be unique without random
    return jwt.sign({ userId, jti: crypto.randomUUID() }, privateRefreshKey, {
        algorithm: "RS256",
        expiresIn: REFRESH_TOKEN_EXP,
    });
};

export const generateAndInsertRefreshToken = async (userId: number) => {
    const token = generateRefreshToken(userId);
    // save token to db
    await createRefreshToken(
        userId,
        token,
        new Date(Date.now() + REFRESH_TOKEN_EXP * 1000),
    );
    return token;
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, publicAccessKey, {
            algorithms: ["RS256"],
        }) as JwtPayload;
    } catch (err) {
        return undefined;
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, publicRefreshKey, {
            algorithms: ["RS256"],
        }) as JwtPayload;
    } catch (err) {
        return undefined;
    }
};

export const attachAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string,
) => {
    return res
        .cookie(ACCESS_TOKEN_KEY, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: ACCESS_TOKEN_EXP * 1000, // Convert seconds to milliseconds
        })
        .cookie(REFRESH_TOKEN_KEY, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: REFRESH_TOKEN_EXP * 1000, // Convert seconds to milliseconds
        });
};

export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie(REFRESH_TOKEN_KEY, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });
};
