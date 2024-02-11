import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import type {} from "eslint-define-config";
import {
  createRule,
  hasOnlyIndexSignatures,
  isAnyType,
  matchObjectMethodCall,
  possiblyContainsUnknownProperties,
} from "../utils";

type Options = [
  {
    allowIndexSignatures?: boolean;
  },
];

declare module "eslint-define-config" {
  export interface CustomRuleOptions {
    "@susisu/safe-typescript/no-unsafe-object-property-overwrite": Options;
    "safe-typescript/no-unsafe-object-property-overwrite": Options;
  }
}

type MessageIds = "noSpreadSyntax" | "noObjectAssign";

export default createRule<Options, MessageIds>({
  name: "no-unsafe-object-property-overwrite",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow possibly unsafe overwrites of object properties",
      requiresTypeChecking: true,
    },
    messages: {
      noSpreadSyntax:
        "The spread syntax possibly overwrites properties with unknown values. Consider moving this to the beginning of the object literal.",
      noObjectAssign:
        "Object.assign() possibly overwrites properties with unknown values. Consider moving this to the beginning of the argument list.",
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          allowIndexSignatures: {
            type: "boolean",
          },
        },
      },
    ],
  },
  defaultOptions: [
    {
      allowIndexSignatures: true,
    },
  ],
  create: (context, [options]) => {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      ObjectExpression: (node) => {
        const tsNodeType = services.getTypeAtLocation(node);
        // Ignore any.
        if (isAnyType(tsNodeType)) {
          return;
        }
        // Mostly safe if the object has only index signatures.
        if (options.allowIndexSignatures && hasOnlyIndexSignatures(checker, tsNodeType)) {
          return;
        }
        // Start from 1 because it's safe if the first spread possibly contains unknown properties.
        for (let i = 1; i < node.properties.length; i++) {
          const prop = node.properties[i];
          if (prop.type !== AST_NODE_TYPES.SpreadElement) {
            continue;
          }
          // Safe if the spread contains only known properties.
          if (!possiblyContainsUnknownProperties(prop.argument)) {
            continue;
          }
          context.report({
            node: prop,
            messageId: "noSpreadSyntax",
          });
        }
      },
      CallExpression: (node) => {
        const method = matchObjectMethodCall(node);
        if (method !== "assign") {
          return;
        }
        // Start from 1 because it's safe if the first argument possibly contains unknown properties.
        for (let i = 1; i < node.arguments.length; i++) {
          const arg = node.arguments[i];
          // Safe if the argument contains only known properties.
          // We do not consider Object.assign(...[{ a: 0, b: 1 }])
          if (arg.type !== AST_NODE_TYPES.SpreadElement) {
            const tsArgType = services.getTypeAtLocation(arg);
            if (isAnyType(tsArgType)) {
              continue;
            }
            if (!possiblyContainsUnknownProperties(arg)) {
              continue;
            }
          }
          context.report({
            node: arg,
            messageId: "noObjectAssign",
          });
        }
      },
    };
  },
});
