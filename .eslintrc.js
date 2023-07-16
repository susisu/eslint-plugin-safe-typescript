"use strict";

module.exports = {
  plugins: ["jest", "jest-formatting"],
  overrides: [
    // source files
    {
      files: ["*.ts"],
      extends: ["@susisu/eslint-config/preset/ts", "plugin:eslint-plugin/recommended", "prettier"],
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      env: {
        es6: true,
        node: true,
      },
      rules: {
        "@typescript-eslint/naming-convention": [
          "warn",
          {
            selector: "variableLike",
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
          {
            selector: "variable",
            format: ["camelCase", "PascalCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
          {
            selector: "memberLike",
            format: ["camelCase"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
          {
            selector: [
              "objectLiteralProperty",
              "typeProperty",
              "objectLiteralMethod",
              "typeMethod",
            ],
            format: ["camelCase", "PascalCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
          {
            selector: [
              "objectLiteralProperty",
              "typeProperty",
              "objectLiteralMethod",
              "typeMethod",
            ],
            modifiers: ["requiresQuotes"],
            format: null,
          },
          {
            selector: "typeLike",
            format: ["PascalCase"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
        ],
      },
    },
    // test files
    {
      files: ["src/**/*.spec.ts", "src/**/__tests__/**/*.ts"],
      extends: ["plugin:jest/recommended", "plugin:jest-formatting/recommended"],
      env: {
        "jest/globals": true,
      },
    },
    // script files
    {
      files: ["*.js"],
      extends: ["@susisu/eslint-config/preset/js", "prettier"],
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "script",
      },
      env: {
        es6: true,
        node: true,
      },
    },
  ],
};
