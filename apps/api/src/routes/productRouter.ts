import { ProductCreateSchema, ProductUpdateSchema } from "@dgmarket/schemas";
import { Router } from "express";

import { UnauthorizedError } from "../errors/index.js";
import {
    authenticate,
    AuthenticatedRequest,
} from "../middleware/authenticate.js";
import { uploadProductImage } from "../middleware/upload.js";
import { ProductService } from "../services/ProductService.js";

export function productRouter(productService: ProductService) {
    const router = Router();

    /* ------------------------------------------------------------------
     * Public routes
     * ------------------------------------------------------------------ */

    // Buyer: list all products
    router.get("/", async (_req, res) => {
        const products = await productService.getPublicProducts();
        res.json(products);
    });

    /* ------------------------------------------------------------------
     * Seller routes (auth required)
     * ------------------------------------------------------------------ */

    // Seller: create product
    router.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
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

        const product = await productService.createProduct(
            req.userId,
            result.data,
        );

        res.status(201).json(product);
    });

    // Seller: list own products
    router.get(
        "/mine",
        authenticate,
        async (req: AuthenticatedRequest, res) => {
            if (!req.userId) {
                throw new UnauthorizedError("Missing userId");
            }

            const products = await productService.getSellerProducts(req.userId);
            res.json(products);
        },
    );

    router.get("/:id", async (req, res) => {
        const id = Number(req.params.id);
        const product = await productService.getPublicProductById(id);

        if (!product) {
            return res.status(404).end();
        }

        res.json(product);
    });

    router.post(
        "/:id/image",
        authenticate,
        uploadProductImage.single("image"),
        async (req: AuthenticatedRequest, res) => {
            if (!req.userId) {
                throw new UnauthorizedError("Missing userId");
            }
            if (!req.file) {
                return res.status(400).json({ message: "No image uploaded" });
            }

            const productId = Number(req.params.id);
            const imageUrl = `/uploads/products/${req.file.filename}`;

            await productService.updateProductImage(
                productId,
                req.userId,
                imageUrl,
            );

            res.json({ imageUrl });
        },
    );

    // Seller: update product
    router.patch(
        "/:productId",
        authenticate,
        async (req: AuthenticatedRequest, res) => {
            if (!req.userId) {
                throw new UnauthorizedError("Missing userId");
            }

            const productId = Number(req.params.productId);
            if (Number.isNaN(productId)) {
                return res.status(400).json({ error: "Invalid productId" });
            }

            const result = ProductUpdateSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({
                    error: "Invalid product data",
                    issues: result.error.issues,
                });
            }

            const product = await productService.updateProduct(
                productId,
                req.userId,
                result.data,
            );

            res.json(product);
        },
    );

    // Seller: delete product
    router.delete(
        "/:productId",
        authenticate,
        async (req: AuthenticatedRequest, res) => {
            if (!req.userId) {
                throw new UnauthorizedError("Missing userId");
            }

            const productId = Number(req.params.productId);
            if (Number.isNaN(productId)) {
                return res.status(400).json({ error: "Invalid productId" });
            }

            await productService.deleteProduct(productId, req.userId);
            res.status(204).send();
        },
    );

    return router;
}
