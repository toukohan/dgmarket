import { globalRules } from "@dgmarket/eslint";

export default [
    ...globalRules,
    {
        settings: {
            "import/resolver": {
                typescript: {
                    project: "./tsconfig.json",
                },
            },
        },
    },
];
