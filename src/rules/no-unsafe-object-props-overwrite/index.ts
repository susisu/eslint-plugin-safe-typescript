import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { createRule, possiblyContainsUnknownProperties } from "../utils";

type Options = [];

type MessageIds = "noSpreadSyntax" | "noObjectAssign";

export default createRule<Options, MessageIds>({
  name: "no-unsafe-object-props-overwrite",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow possibly unsafe overwrites of object properties",
      recommended: "warn",
    },
    messages: {
      noSpreadSyntax:
        "The spread syntax possibly overwrites properties with unknown values. Consider moving this to the beginning of the object literal.",
      noObjectAssign:
        "Object.assign() possibly overwrites properties with unknown values. Consider moving this to the beginning of the argument list.",
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
      const firstProp = parent.properties.length > 0 ? parent.properties[0] : undefined;
      if (node === firstProp) {
        return;
      }
      // Safe if only contains known properties.
      if (!possiblyContainsUnknownProperties(node.argument)) {
        return;
      }
      context.report({
        node,
        messageId: "noSpreadSyntax",
      });
    },
    CallExpression: node => {
      if (!testObjectAssign(node.callee)) {
        return;
      }
      // Start from 1 because it's safe if the first argument has possibly unknown properties.
      for (let i = 1; i < node.arguments.length; i++) {
        const arg = node.arguments[i];
        // Safe if only contains known properties.
        // We do not consider Object.assign(...[{ a: 0, b: 1 }])
        if (arg.type !== AST_NODE_TYPES.SpreadElement && !possiblyContainsUnknownProperties(arg)) {
          continue;
        }
        context.report({
          node: arg,
          messageId: "noObjectAssign",
        });
      }
    },
  }),
});

function testObjectAssign(node: TSESTree.Expression): boolean {
  // We do not consider the following cases:
  // - const m = Object.assign; m(x)
  // - const o = Object; o.assign(x)
  // - const k = "assign"; Object[k](x)
  if (node.type !== AST_NODE_TYPES.MemberExpression) {
    return false;
  }
  const { object, property } = node;
  if (object.type !== AST_NODE_TYPES.Identifier || object.name !== "Object") {
    return false;
  }
  if (property.type === AST_NODE_TYPES.Identifier) {
    if (node.computed) {
      return false;
    }
    return property.name === "assign";
  } else if (property.type === AST_NODE_TYPES.Literal) {
    return property.value === "assign";
  } else {
    return false;
  }
}
