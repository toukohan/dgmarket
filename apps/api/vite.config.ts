import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "node",
    root: ".",
    setupFiles: ["./tests/setup/testApp.ts", "./tests/setup/testDb.ts"],
    include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
