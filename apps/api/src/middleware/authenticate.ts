import { Request, Response, NextFunction } from "express";

import { UnauthorizedError } from "../../../../packages/api-client/errors";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
    userId?: number;
    userRole?: string;
}

export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) {
    const token = req.cookies.accessToken;

    if (!token) {
        return next(new UnauthorizedError("Access token required"));
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
        return next(new UnauthorizedError("Invalid or expired access token"));
    }

    req.userId = payload.userId as number;
    req.userRole = payload.role as string;
    next();
}
