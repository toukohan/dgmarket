import { NextFunction, Request, Response } from "express";

import { ApiError } from "../../../../packages/api-client/src/errors";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.serialize());
    }

    console.error(err);

    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        },
    });
};
