import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";

import { Db, DbRequest } from "./database/index.js";
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
    app.use(express.json());

    app.use("/uploads", (req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    });
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
    app.get("/api/health", (req: DbRequest, res) => {
        res.json({ ok: true });
    });
    app.use("/api/auth", authRouter);
    app.use("/api/products", productRouter(productService));
    app.use(errorHandler);
    return app;
}
