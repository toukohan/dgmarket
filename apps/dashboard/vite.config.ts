import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
const root = path.resolve(__dirname, "..", "..");
console.log("vite config:", root);

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@/api": path.resolve(root, "./packages/api"),
            "@/types": path.resolve(root, "./packages/types"),
            "@/schemas": path.resolve(root, "./packages/schemas"),
        },
    },
    server: {
        fs: {
            allow: ["../.."],
        },
    },
});
