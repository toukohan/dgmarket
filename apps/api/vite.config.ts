import path from "path";
import { defineConfig } from "vitest/config";
const root = path.resolve(__dirname, "..", "..");
console.log("vite config:", root);

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@/api": path.resolve(root, "./packages/api"),
            "@/types": path.resolve(root, "./packages/types"),
            "@/schemas": path.resolve(root, "./packages/schemas"),
        },
    },
    test: {
        environment: "node",
        root: ".",
        setupFiles: ["./tests/setup/testApp.ts", "./tests/setup/testDb.ts"],
        include: ["./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
});
