import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";

import { Db } from "./database/index.js";
import { dbMiddleware } from "./middleware/dbMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { ProductRepository } from "./repositories/ProductRepository.js";
import authRouter from "./routes/authRouter.js";
import { productRouter } from "./routes/productRouter.js";
import { ProductService } from "./services/ProductService.js";

export function createApp(db: Db) {
    const app = express();
    const productRepository = new ProductRepository(db);
    const productService = new ProductService(productRepository);

    app.set("trust proxy", 1);
    app.use(dbMiddleware(db));

    app.use(
        helmet({
            contentSecurityPolicy: false, // for development
        }),
    );
    const corsOptions: CorsOptions = {
        origin: process.env.CORS_ORIGIN?.split(",") || [
            "http://localhost:5173",
            "http://localhost:3000",
        ],
        credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(cookieParser());

    app.use(express.json({ limit: "2mb" }));

    app.use("/uploads", (req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    });
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
    app.get("/api/health", (_req, res) => {
        res.status(200).json({ status: "ok" });
    });
    app.get("/api/ready", async (_req, res) => {
        try {
            await db.query("select 1");
            res.status(200).json({ status: "ready" });
        } catch {
            res.status(503).json({ status: "not-ready" });
        }
    });
    app.use("/api/auth", authRouter);
    app.use("/api/products", productRouter(productService));
    app.use(errorHandler);
    return app;
}
