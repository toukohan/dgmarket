import * as js from "@eslint/js"
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

import { ignoredFolders } from "../internal-utils";

export const baseSharableConfig = defineConfig([
    ignoredFolders,
    {
        files: ["**/*.ts", "**/*.js", "**/*.tsx", "**/*.jsx"],
        extends: [js.configs.recommended, tseslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                project: ["../../../../tsconfig.json"], // the root tsconfig.json
                tsconfigRootDir: import.meta.dirname,
            },
        },

        settings: {
            "import/resolver": {
                typescript: {},
            },
        },
        rules: {
            "no-console": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
]);