import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads/products");

fs.mkdirSync(uploadDir, { recursive: true });

export const uploadProductImage = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const productId = req.params.id;
            const ext = path.extname(file.originalname);
            cb(null, `${productId}${ext}`);
        },
    }),
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"));
            return;
        }
        cb(null, true);
    },
});
