// eslint-disable-next-line @typescript-eslint/no-unused-vars -- fix TS2742 error
import type { ESLintUtils } from "@typescript-eslint/utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type {} from "eslint-define-config";
import { createRule, matchObjectMethodCall } from "../utils";

type Options = [];

declare module "eslint-define-config" {
  export interface CustomRuleOptions {
    "@susisu/safe-typescript/no-object-assign": Options;
  }
}

type MessageIds = "noCopying" | "noMutation";

export default createRule<Options, MessageIds>({
  name: "no-object-assign",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow the use of Object.assign()",
    },
    messages: {
      noCopying:
        "Using Object.assign() to copy objects is not recommended. Use the object spread syntax instead.",
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
      if (node.arguments.length > 0 && node.arguments[0].type === AST_NODE_TYPES.ObjectExpression) {
        context.report({
          node,
          messageId: "noCopying",
        });
      } else {
        context.report({
          node,
          messageId: "noMutation",
        });
      }
    },
  }),
});
