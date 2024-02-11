import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import type {} from "eslint-define-config";
import {
  createRule,
  hasIndexSignatures,
  isAnyType,
  isNonPrimitiveType,
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
    "@susisu/safe-typescript/no-unsafe-object-enum-method": Options;
  }
}

type MessageIds = "noEnumMethod";

export default createRule<Options, MessageIds>({
  name: "no-unsafe-object-enum-method",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow possibly unsafe property enumeration methods of Object",
      requiresTypeChecking: true,
    },
    messages: {
      noEnumMethod:
        "Object.{{method}}() possibly enumerates unknown properties. Consider enumerating only known properties of the object.",
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
      CallExpression: (node) => {
        const method = matchObjectMethodCall(node);
        if (!isObjectEnumMethod(method)) {
          return;
        }
        const arg = node.arguments.length > 0 ? node.arguments[0] : undefined;
        if (!arg) {
          return;
        }
        // We do not consider the following cases:
        // - Object.keys(...[{ a: 0, b: 1 }])
        // - declare const x: { [key: string]: number }; Object.keys(...[x])
        if (arg.type !== AST_NODE_TYPES.SpreadElement) {
          // Safe if only contains known properties.
          if (!possiblyContainsUnknownProperties(arg)) {
            return;
          }
          const tsArgType = services.getTypeAtLocation(arg);
          // The enumeration methods work propertly for the any and non-primitive types.
          if (isAnyType(tsArgType) || isNonPrimitiveType(tsArgType)) {
            return;
          }
          // Mostly safe if the argument has index signatures.
          if (options.allowIndexSignatures && hasIndexSignatures(checker, tsArgType)) {
            return;
          }
        }
        context.report({
          node,
          messageId: "noEnumMethod",
          data: { method },
        });
      },
    };
  },
});

const objectEnumMethods = ["keys", "values", "entries"] as const;
type ObjectEnumMethod = (typeof objectEnumMethods)[number];

function isObjectEnumMethod(value: unknown): value is ObjectEnumMethod {
  return objectEnumMethods.some((method) => method === value);
}
