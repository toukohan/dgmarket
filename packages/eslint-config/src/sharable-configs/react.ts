import { defineConfig } from "eslint/config";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

import { ignoredFolders } from "../internal-utils";

export const reactSharableConfig = defineConfig([
    ignoredFolders,
    {
        files: ["**/*.tsx", "**/*.jsx"],
        extends: [
            jsxA11Y.flatConfigs.recommended,
            reactHooks.configs.flat["recommended-latest"],
            react.configs.flat["recommended"],
            react.configs.flat["jsx-runtime"],
        ],
        plugins: {
            react,
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                window: true,
                document: true,
                navigator: true,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/prop-types": "off",
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-sort-props": "off",
            "jsx-a11y/interactive-supports-focus": "warn",
        },
    },
]);
