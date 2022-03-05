import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule, possiblyContainsUnknownProperties } from "../utils";

type Options = [];

type MessageIds = "possiblyUnsafe";

export default createRule<Options, MessageIds>({
  name: "no-unsafe-object-props-overwrite",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow possibly unsafe overwrites of object properties",
      recommended: "warn",
    },
    messages: {
      possiblyUnsafe:
        "The spread syntax possibly overwrites properties with unknown values. Consider moving it to the beginning of the object literal.",
    },
    schema: [],
  },
  defaultOptions: [],
  create: context => ({
    SpreadElement: node => {
      const parent = node.parent;
      if (!parent || parent.type !== AST_NODE_TYPES.ObjectExpression) {
        return;
      }
      // Safe if used at the beginning of the object literal.
      const firstProperty = parent.properties.length > 0 ? parent.properties[0] : undefined;
      if (node === firstProperty) {
        return;
      }
      // Safe if only contains known properties.
      if (!possiblyContainsUnknownProperties(node.argument)) {
        return;
      }
      context.report({
        node,
        messageId: "possiblyUnsafe",
      });
    },
  }),
});
