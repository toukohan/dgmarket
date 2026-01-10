import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

dotenv.config({ path: ".env.test" });
console.log("vitest configt. postgres DB:", process.env.POSTGRES_DB);

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        environment: "node",
        root: ".",
        // run env first to make sure setup uses different database
        globalSetup: ["./tests/setup/globalSetup.ts"],
        setupFiles: ["./tests/setup/testApp.ts", "./tests/setup/testDb.ts"],
        include: ["./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
});
