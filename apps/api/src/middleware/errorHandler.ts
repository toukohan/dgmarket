import { ErrorRequestHandler } from "express";

import { ApiError } from "../errors/index.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
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
