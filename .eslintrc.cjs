module.exports = {
  root: true,
  extends: ["moving-meadow", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  overrides: [
    {
      files: ["**/*.ts"],
      rules: {
        "unicorn/no-null": "off",
        "node/no-unsupported-features/es-syntax": "off",
        "import/no-relative-parent-imports": "off",
        "sort-imports": "off",
        "unicorn/prefer-module": "error",
        "unicorn/no-array-for-each": "off",
        // TypeScript + esm modules haven't landed with the eslint node &
        // import teams yet.
        "node/no-missing-import": "off",
        "import/no-unresolved": "off",
      },
      parserOptions: {
        ecmaVersion: "latest",
      },
    },
    {
      files: ["**/*.spec.ts"],
      env: {
        mocha: true,
      },
      rules: {
        "no-magic-numbers": "off",
      },
    },
  ],
};
