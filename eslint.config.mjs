import typescriptEslint from "@typescript-eslint/eslint-plugin";
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
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("moving-meadow", "plugin:@typescript-eslint/recommended"),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "script",
    },
  },
  {
    files: ["**/*.ts"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
    },

    rules: {
      "unicorn/no-null": "off",
      "node/no-unsupported-features/es-syntax": "off",
      "import/no-relative-parent-imports": "off",
      "sort-imports": "off",
      "unicorn/prefer-module": "error",
      "unicorn/no-array-for-each": "off",
      "n/no-missing-import": "off",
      "n/no-unsupported-features/node-builtins": "off",
      "import/no-unresolved": "off",
    },
  },
  {
    files: ["**/*.test.ts"],

    rules: {
      "no-magic-numbers": "off",
      "security/detect-non-literal-fs-filename": "off",
      "max-lines-per-function": "off",
    },
  },
];
