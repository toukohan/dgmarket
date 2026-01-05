import jwt, { JwtPayload } from "jsonwebtoken"
import fs from "fs"
import path from 'path'
import { UserRole } from "@/types/user"
import { Response } from "express";
import { createRefreshToken } from "../repositories/tokenRepository";

export interface AccessTokenPayload {
  userId: number;
  role: UserRole;
}

const ACCESS_TOKEN_EXP = 15 * 60;           // 15 minutes
const REFRESH_TOKEN_EXP = 7 * 24 * 60 * 60; // 7 days
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

function loadKey(envName: string) {
    const p = process.env[envName];
    if (!p) throw new Error(`${envName} is not set`);
    const joined = path.join(process.cwd(), p)
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
        expiresIn: ACCESS_TOKEN_EXP
});

export const generateRefreshToken = (userId: number) => {
    // seems that tests generate tokens within the same second so token wont be unique without random
    return jwt.sign({ userId, jti: crypto.randomUUID() }, privateRefreshKey, {
        algorithm: "RS256",
        expiresIn: REFRESH_TOKEN_EXP
    });
};

export const generateAndInsertRefreshToken = async (userId: number) => {
    const token = generateRefreshToken(userId);
    // save token to db
    await createRefreshToken(userId, token, new Date(Date.now() + REFRESH_TOKEN_EXP * 1000))
    return token;
}


export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, publicAccessKey, { algorithms: ['RS256']}) as JwtPayload
    } catch (err) {
        return undefined
    }
}

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, publicRefreshKey, { algorithms: ['RS256']}) as JwtPayload
    } catch (err) {
        return undefined
    }
}

export const attachAccessTokenCookie = (res: Response, accessToken: string) => {
    res.cookie(ACCESS_TOKEN_KEY, accessToken, {
       httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/refresh",
        maxAge: ACCESS_TOKEN_EXP 
    })
}

export const attachRefreshTokenCookie = (res: Response, refreshToken: string) => {
    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/refresh",
        maxAge: REFRESH_TOKEN_EXP
    })
}

export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie(REFRESH_TOKEN_KEY, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/auth/refresh",
    });
}

