import { registerSchema, loginSchema } from "@dgmarket/schemas";
import { Router } from "express";

import { extractDb } from "@/database";
import { InvalidTokenError, MissingTokenError } from "@/errors";

import { validate } from "../middleware/validate";
import { login, register, logout, refresh } from "../services/auth.service";
import { verifyRefreshToken, attachAuthCookies } from "../utils/jwt";

const router = Router();

router.post("/refresh", async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    const db = extractDb(req);

    if (!refreshToken) {
        return next(new MissingTokenError());
    }

    // Verify JWT
    const payload = verifyRefreshToken(refreshToken);
    if (!payload)
        return next(new InvalidTokenError("Refresh token invalid or expired"));

    const {
        user,
        accessToken,
        refreshToken: newRefreshToken,
    } = await refresh(refreshToken, payload, db);

    res = attachAuthCookies(res, accessToken, newRefreshToken);

    res.status(200).json({ user });
});

router.post("/login", validate(loginSchema), async (req, res) => {
    const { email, password } = req.body;
    const db = extractDb(req);

    const { user, accessToken, refreshToken } = await login(
        email,
        password,
        db,
    );

    res = attachAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({ user });
});

router.post("/register", validate(registerSchema), async (req, res) => {
    const { name, email, password } = req.body;
    const db = extractDb(req);
    const { user, accessToken, refreshToken } = await register(
        email,
        password,
        name,
        db,
    );

    res = attachAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({ user });
});

router.post("/logout", async (req, res) => {
    const db = extractDb(req);

    const session = req.cookies.refreshToken;
    if (!session) {
        return res.sendStatus(204); // already logged out
    }

    await logout(session, db); // revoke refresh token

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    res.sendStatus(204);
});

export default router;
