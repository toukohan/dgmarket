import { globalIgnores } from "eslint/config";

export const ignoredFolders = globalIgnores([
    "**/node_modules/**",
    "**/dist/**",
    "**/.next/**",
    "**/build/**",
    "**/out/**",
    "next-env.d.ts",
]);
