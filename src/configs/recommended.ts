import type { ESLint, Linter } from "eslint";

const config: ESLint.ConfigData & Linter.Config = {
  name: "@susisu/safe-typescript/recommended",
  rules: {
    "@susisu/safe-typescript/no-object-assign": "error",
    "@susisu/safe-typescript/no-type-assertion": "error",
    "@susisu/safe-typescript/no-unsafe-object-enum-method": "error",
    "@susisu/safe-typescript/no-unsafe-object-property-check": "error",
    "@susisu/safe-typescript/no-unsafe-object-property-overwrite": "error",
  },
};

export default config;
