import { ESLintUtils } from "@typescript-eslint/utils";

// eslint-disable-next-line new-cap
export const createRule = ESLintUtils.RuleCreator(
  ruleName =>
    `https://github.com/susisu/eslint-plugin-safe-typescript/src/rules/${ruleName}/README.md`
);
