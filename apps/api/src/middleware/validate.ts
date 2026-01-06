import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validate =
    <T>(schema: ZodType<T>, source: "body" | "query" = "body") =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = source === "query" ? req.query : req.body;
            schema.parse(data); // runtime validation
            next();
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    error: {
                        code: "VALIDATION_ERROR",
                        message: err.issues.map((e) => e.message).join(", "),
                    },
                });
            }
            next(err);
        }
    };
