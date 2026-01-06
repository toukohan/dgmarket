import { defineConfig } from "eslint/config";
import jsoncPlugin from "eslint-plugin-jsonc";
import * as prettier from "eslint-plugin-prettier";

import { ignoredFolders } from "../internal-utils";

export const jsonSharableConfig = defineConfig([
    ignoredFolders,
    {
        files: ["**/*.json", "**/*.jsonc"],
        extends: [jsoncPlugin.configs["flat/recommended-with-jsonc"]],
        plugins: {
            prettier,
        },
        rules: {
            "prettier/prettier": [
                "error",
                {
                    trailingComma: "all",
                    tabWidth: 4,
                },
            ],
        },
    },
]);
