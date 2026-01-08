import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        environment: "node",
        root: ".",
        // run env first to make sure setup uses different database
        setupFiles: [
            "./tests/setup/env.ts",
            "./tests/setup/testApp.ts",
            "./tests/setup/testDb.ts",
        ],
        include: ["./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
});
