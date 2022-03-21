import { AST_NODE_TYPES, ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import ts from "typescript";

// eslint-disable-next-line new-cap
export const createRule = ESLintUtils.RuleCreator(
  ruleName =>
    `https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/${ruleName}/README.md`
);

/**
 * Checks if the value of the expression possibly contains properties that do not appear in its type.
 */
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

/**
 * Checks if the type is the any type.
 */
export function isAnyType(type: ts.Type): boolean {
  return (type.flags & ts.TypeFlags.Any) !== 0;
}

/**
 * Checks if the type is the non-primitive type i.e. `object`.
 */
export function isNonPrimitiveType(type: ts.Type): boolean {
  return (type.flags & ts.TypeFlags.NonPrimitive) !== 0;
}

/**
 * Checks if the type has index signatures.
 */
export function hasIndexSignatures(checker: ts.TypeChecker, type: ts.Type): boolean {
  return checker.getIndexInfosOfType(type).length > 0;
}

/**
 * Checks if the type has only index signatures.
 */
export function hasOnlyIndexSignatures(checker: ts.TypeChecker, type: ts.Type): boolean {
  return hasIndexSignatures(checker, type) && checker.getPropertiesOfType(type).length === 0;
}
