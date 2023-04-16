import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule } from "../utils";

type Options = [];

type MessageIds = "noTypeAssertion";

export default createRule<Options, MessageIds>({
  name: "no-type-assertion",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow type assertions",
      recommended: "error",
    },
    messages: {
      noTypeAssertion: "A type assertion `x as T` possibly involves unsafe downcasting.",
    },
    schema: [],
  },
  defaultOptions: [],
  create: context => ({
    TSAsExpression: node => {
      const annotation = node.typeAnnotation;
      // `as const` is a safe expression
      if (
        annotation.type === AST_NODE_TYPES.TSTypeReference &&
        annotation.typeName.type === AST_NODE_TYPES.Identifier &&
        annotation.typeName.name === "const"
      ) {
        return;
      }
      // `as unknown` is safe
      // `as any` is unsafe, but that is because of `any`, not `as`
      if (
        annotation.type === AST_NODE_TYPES.TSUnknownKeyword ||
        annotation.type === AST_NODE_TYPES.TSAnyKeyword
      ) {
        return;
      }
      context.report({
        node,
        messageId: "noTypeAssertion",
      });
    },
  }),
});
