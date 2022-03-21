import { AST_NODE_TYPES, ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import {
  createRule,
  hasOnlyIndexSignatures,
  isAnyType,
  possiblyContainsUnknownProperties,
} from "../utils";

type Options = [
  {
    allowIndexSignatures?: boolean;
  }
];

type MessageIds = "noSpreadSyntax" | "noObjectAssign";

export default createRule<Options, MessageIds>({
  name: "no-unsafe-object-property-overwrite",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow possibly unsafe overwrites of object properties",
      recommended: "error",
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
      ObjectExpression: node => {
        const tsNode = services.esTreeNodeToTSNodeMap.get(node);
        const tsNodeType = checker.getTypeAtLocation(tsNode);
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
      CallExpression: node => {
        if (!testObjectAssign(node.callee)) {
          return;
        }
        // Start from 1 because it's safe if the first argument possibly contains unknown properties.
        for (let i = 1; i < node.arguments.length; i++) {
          const arg = node.arguments[i];
          // Safe if the argument contains only known properties.
          // We do not consider Object.assign(...[{ a: 0, b: 1 }])
          if (arg.type !== AST_NODE_TYPES.SpreadElement) {
            const tsArg = services.esTreeNodeToTSNodeMap.get(arg);
            const tsArgType = checker.getTypeAtLocation(tsArg);
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
