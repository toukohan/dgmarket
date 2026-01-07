import { registerSchema, loginSchema } from "@dgmarket/schemas";
import { Response, Request, Router, NextFunction } from "express";

import {
    InvalidTokenError,
    MissingTokenError,
} from "../../../../packages/api-client/src/errors";
import { validate } from "../middleware/validate";
import { login, register, logout, refresh } from "../services/authService";
import { verifyRefreshToken, attachAuthCookies } from "../utils/jwt";

const router = Router();

router.post(
    "/refresh",
    async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return next(new MissingTokenError());
        }

        // Verify JWT
        const payload = verifyRefreshToken(refreshToken);
        if (!payload)
            return next(
                new InvalidTokenError("Refresh token invalid or expired"),
            );
        const {
            user,
            accessToken,
            refreshToken: newToken,
        } = await refresh(refreshToken, payload);

        res = attachAuthCookies(res, accessToken, newToken);

        res.status(200).json({ user });
    },
);

router.post(
    "/login",
    validate(loginSchema),
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await login(
            email,
            password,
        );

        res = attachAuthCookies(res, accessToken, refreshToken);

        res.status(200).json({ user });
    },
);

router.post(
    "/register",
    validate(registerSchema),
    async (req: Request, res: Response) => {
        const { name, email, password } = req.body;
        const { user, accessToken, refreshToken } = await register(
            email,
            password,
            name,
        );

        res = attachAuthCookies(res, accessToken, refreshToken);

        res.status(201).json({ user });
    },
);

router.post("/logout", async (req, res, next) => {
    try {
        const session = req.cookies.refreshToken;
        if (!session) {
            return res.sendStatus(204); // already logged out
        }

        await logout(session); // revoke refresh token

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

export default router;
