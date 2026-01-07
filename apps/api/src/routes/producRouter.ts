import { ProductCreateSchema } from "@dgmarket/schemas";
import { NextFunction, Router } from "express";

import { UnauthorizedError } from "@/errors";
import { createProduct } from "@/services/product.service";

import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";

const router = Router();

router.post(
    "/",
    authenticate,
    async (req: AuthenticatedRequest, res, next: NextFunction) => {
        if (!req.userId) {
            throw new UnauthorizedError("Missing userId");
        }
        const result = ProductCreateSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: "Invalid product data",
                issues: result.error.issues,
            });
        }
        try {
            const product = await createProduct(req.userId, req.body);
            res.status(201).json(product);
        } catch (err) {
            next(err);
        }
    },
);

export default router;
