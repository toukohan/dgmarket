import { defineConfig } from "eslint/config";
import * as eslintPluginImport from "eslint-plugin-import";
import * as prettier from "eslint-plugin-prettier";

import { ignoredFolders } from "../internal-utils";

export const utilsSharableConfig = defineConfig([
    ignoredFolders,
    {
        files: ["**/*.ts", "**/*.js", "**/*.tsx", "**/*.jsx"],
        plugins: {
            prettier,
            import: eslintPluginImport,
        },
        settings: {
            "import/resolver": {
                typescript: {},
            },
        },

        rules: {
            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    semi: true,
                    arrowParens: "always",
                    trailingComma: "all",
                    endOfLine: "auto",
                    tabWidth: 4,
                },
            ],
            "import/order": [
                "error",
                {
                    groups: [
                        ["builtin", "external"], // node and external libs (fs, react, lodash)
                        ["internal"], // imports with project alias (@/lib/..., etc.)
                        ["parent", "sibling", "index"], // relative imports (../, ./, index.ts)
                        ["type"], // type imports
                    ],
                    pathGroups: [
                        {
                            pattern: "react",
                            group: "external",
                            position: "before", // react always first
                        },
                        {
                            pattern: "@/**", // if you use tsconfig paths
                            group: "internal",
                        },
                    ],
                    pathGroupsExcludedImportTypes: ["react"],

                    "newlines-between": "always", // blank line between groups
                    alphabetize: { order: "asc", caseInsensitive: true }, // alphabetical order within the group
                },
            ],
        },
    },
]);
