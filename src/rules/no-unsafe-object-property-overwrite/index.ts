import { AST_NODE_TYPES, AST_TOKEN_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import {
  createRule,
  hasOnlyIndexSignatures,
  isAnyType,
  matchObjectMethodCall,
  possiblyContainsUnknownProperties,
} from "../utils.js";

type Options = [
  {
    allowIndexSignatures?: boolean;
  },
];

type MessageIds = "noSpreadSyntax" | "noObjectAssign" | "suggestMoveSpreadSyntax";

const rule = createRule<Options, MessageIds>({
  name: "no-unsafe-object-property-overwrite",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow possibly unsafe overwrites of object properties",
      requiresTypeChecking: true,
    },
    hasSuggestions: true,
    messages: {
      noSpreadSyntax:
        "The spread syntax possibly overwrites properties with unknown values. Consider moving this to the beginning of the object literal.",
      noObjectAssign:
        "Object.assign() possibly overwrites properties with unknown values. Consider moving this to the beginning of the argument list.",
      suggestMoveSpreadSyntax: "Move the spread syntax to the front.",
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          allowIndexSignatures: {
            type: "boolean",
            description:
              "When set to `true`, allows object spreads in any position if the object's type has only index signatures e.g. `{ [key: string]: number }`.",
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
        // Nothing to check.
        if (node.properties.length <= 1) {
          return;
        }
        const firstNonSpreadProp = node.properties.find(
          (prop) => prop.type !== AST_NODE_TYPES.SpreadElement,
        );
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
            suggest:
              firstNonSpreadProp ?
                [
                  {
                    messageId: "suggestMoveSpreadSyntax",
                    *fix(fixer) {
                      const nextToken = context.sourceCode.getTokenAfter(prop);
                      const hasTrailingComma =
                        !!nextToken
                        && nextToken.type === AST_TOKEN_TYPES.Punctuator
                        && nextToken.value === ",";
                      yield fixer.insertTextBefore(
                        firstNonSpreadProp,
                        context.sourceCode.getText(prop) + ",",
                      );
                      yield fixer.remove(prop);
                      if (hasTrailingComma) {
                        yield fixer.removeRange(nextToken.range);
                      }
                    },
                  },
                ]
              : [],
          });
        }
      },
      CallExpression: (node) => {
        const method = matchObjectMethodCall(node);
        if (method !== "assign") {
          return;
        }
        // Nothing to check.
        if (node.arguments.length <= 1) {
          return;
        }
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

export default rule;
