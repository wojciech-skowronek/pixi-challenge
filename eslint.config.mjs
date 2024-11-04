import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/*.css", "**/*.svg", "**/dist/", "**/node_modules/"],
}, ...compat.extends(
    "plugin:prettier/recommended",
    "prettier/prettier",
    "eslint:recommended",
).map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.js"],
})), {
    files: ["**/*.ts", "**/*.js"],

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser,
            browser: true,
            chrome: true,
        },

        parser: tsParser,
        ecmaVersion: 12,
        sourceType: "module",
    },

    rules: {
        curly: ["error", "all"],
        "no-case-declarations": "off",
        "no-await-in-loop": "off",
        "no-underscore-dangle": "off",
        "no-restricted-syntax": "off",
        "import/no-unresolved": "off",
        "import/extensions": "off",
        "import/prefer-default-export": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
        "no-unused-vars": "off",
        "class-methods-use-this": "off",

        "prefer-const": "error",
        "no-bitwise": "off",
        "no-new": "off",
        "no-use-before-define": "off",
        "no-empty-function": "off",
        "no-useless-constructor": "off",
        "no-return-assign": "off",
        "@typescript-eslint/no-useless-constructor": ["error"],

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "no-console": "off",
        "no-param-reassign": "off",
        "max-classes-per-file": ["error", 20],
    },
}];