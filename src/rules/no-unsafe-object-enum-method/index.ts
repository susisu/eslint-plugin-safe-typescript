import { AST_NODE_TYPES, ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import {
  createRule,
  hasIndexSignature,
  isAnyType,
  isNonPrimitiveType,
  possiblyContainsUnknownProperties,
} from "../utils";

type Options = [
  {
    allowIndexSignatures?: boolean;
  }
];

type MessageIds = "noEnumMethod";

export default createRule<Options, MessageIds>({
  name: "no-unsafe-object-enum-method",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow possibly unsafe property enumeration methods of Object",
      recommended: "warn",
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
      CallExpression: node => {
        const method = matchObjectEnumMethod(node.callee);
        if (!method) {
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
          // Mostly safe if the argument has an index signature or is the non-primitive type.
          const tsArg = services.esTreeNodeToTSNodeMap.get(arg);
          const type = checker.getTypeAtLocation(tsArg);
          if (isAnyType(type) || isNonPrimitiveType(type)) {
            return;
          }
          if (options.allowIndexSignatures && hasIndexSignature(checker, type)) {
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
type ObjectEnumMethod = typeof objectEnumMethods[number];

function isObjectEnumMethod(value: unknown): value is ObjectEnumMethod {
  return objectEnumMethods.some(method => method === value);
}

function matchObjectEnumMethod(node: TSESTree.Expression): ObjectEnumMethod | undefined {
  // We do not consider the following cases:
  // - const m = Object.keys; m(x)
  // - const o = Object; o.keys(x)
  // - const k = "keys"; Object[k](x)
  if (node.type !== AST_NODE_TYPES.MemberExpression) {
    return undefined;
  }
  const { object, property } = node;
  if (object.type !== AST_NODE_TYPES.Identifier || object.name !== "Object") {
    return undefined;
  }
  if (property.type === AST_NODE_TYPES.Identifier) {
    if (node.computed) {
      return undefined;
    }
    const method = property.name;
    return isObjectEnumMethod(method) ? method : undefined;
  } else if (property.type === AST_NODE_TYPES.Literal) {
    const method = property.value;
    return isObjectEnumMethod(method) ? method : undefined;
  } else {
    return undefined;
  }
}
