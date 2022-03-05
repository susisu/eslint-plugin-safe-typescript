import { TSESTree } from "@typescript-eslint/utils";
import { createRule } from "../../utils";

type Options = [];

type MessageIds = "possiblyUnsafe";

export default createRule<Options, MessageIds>({
  name: "no-unsafe-object-spread",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow unsafe use of the spread syntax in object literals",
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
      if (!parent || parent.type !== "ObjectExpression") {
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

function possiblyContainsUnknownProperties(node: TSESTree.Expression): boolean {
  if (node.type !== "ObjectExpression") {
    return true;
  }
  return node.properties.some(prop => {
    if (prop.type === "SpreadElement") {
      return possiblyContainsUnknownProperties(prop.argument);
    } else {
      return false;
    }
  });
}
