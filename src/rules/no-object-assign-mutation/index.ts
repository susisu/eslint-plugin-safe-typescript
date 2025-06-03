import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule, matchObjectMethodCall } from "../utils";

type Options = [];

type MessageIds = "noMutation";

const rule = createRule<Options, MessageIds>({
  name: "no-object-assign-mutation",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow mutations using Object.assign()",
    },
    messages: {
      noMutation: "Object.assign() mutates the first argument without knowing its type.",
    },
    schema: [],
  },
  defaultOptions: [],
  create: (context) => ({
    CallExpression: (node) => {
      const method = matchObjectMethodCall(node);
      if (method !== "assign") {
        return;
      }
      if (
        node.arguments.length >= 2
        && node.arguments[0].type !== AST_NODE_TYPES.ObjectExpression
      ) {
        context.report({
          node,
          messageId: "noMutation",
        });
      }
    },
  }),
});

export default rule;
