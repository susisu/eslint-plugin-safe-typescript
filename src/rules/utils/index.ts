import { AST_NODE_TYPES, ESLintUtils, TSESTree } from "@typescript-eslint/utils";

// eslint-disable-next-line new-cap
export const createRule = ESLintUtils.RuleCreator(
  ruleName =>
    `https://github.com/susisu/eslint-plugin-safe-typescript/src/rules/${ruleName}/README.md`
);

export function possiblyContainsUnknownProperties(node: TSESTree.Expression): boolean {
  if (node.type !== AST_NODE_TYPES.ObjectExpression) {
    return true;
  }
  return node.properties.some(prop => {
    if (prop.type === AST_NODE_TYPES.SpreadElement) {
      return possiblyContainsUnknownProperties(prop.argument);
    } else {
      return false;
    }
  });
}
