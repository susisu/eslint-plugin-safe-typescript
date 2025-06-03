import type { TSESTree } from "@typescript-eslint/utils";
import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import ts from "typescript";

export type PluginDocs = {
  requiresTypeChecking?: boolean | undefined;
};

// eslint-disable-next-line new-cap
export const createRule = ESLintUtils.RuleCreator<PluginDocs>(
  (ruleName) =>
    `https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/${ruleName}/README.md`,
);

/**
 * Checks if the value of the expression possibly contains properties that do not appear in its type.
 */
export function possiblyContainsUnknownProperties(node: TSESTree.Expression): boolean {
  if (node.type === AST_NODE_TYPES.ObjectExpression) {
    return node.properties.some((prop) => {
      if (prop.type === AST_NODE_TYPES.SpreadElement) {
        return possiblyContainsUnknownProperties(prop.argument);
      } else {
        return false;
      }
    });
  } else if (node.type === AST_NODE_TYPES.ConditionalExpression) {
    return (
      possiblyContainsUnknownProperties(node.consequent)
      || possiblyContainsUnknownProperties(node.alternate)
    );
  } else {
    return true;
  }
}

/**
 * Matches Object method call and returns the method's name.
 */
export function matchObjectMethodCall(node: TSESTree.CallExpression): string | undefined {
  const { callee } = node;
  // We do not consider the following cases:
  // - const m = Object.keys; m(x)
  // - const o = Object; o.keys(x)
  // - const k = "keys"; Object[k](x)
  if (callee.type !== AST_NODE_TYPES.MemberExpression) {
    return undefined;
  }
  const { object, property } = callee;
  if (object.type !== AST_NODE_TYPES.Identifier || object.name !== "Object") {
    return undefined;
  }
  if (property.type === AST_NODE_TYPES.Identifier) {
    if (callee.computed) {
      return undefined;
    }
    const method = property.name;
    return method;
  } else if (property.type === AST_NODE_TYPES.Literal) {
    const method = property.value;
    if (typeof method !== "string") {
      return undefined;
    }
    return method;
  } else {
    return undefined;
  }
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
