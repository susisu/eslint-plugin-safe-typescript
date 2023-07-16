import { ESLintUtils } from "@typescript-eslint/utils";
import { createRule, hasIndexSignatures, isAnyType, isNonPrimitiveType } from "../utils";

type Options = [];

type MessageIds = "noInOperator";

export default createRule<Options, MessageIds>({
  name: "no-unsafe-object-property-check",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow possibly unsafe property checks of object",
      requiresTypeChecking: true,
    },
    messages: {
      noInOperator:
        "Type narrowing using the `in` operator is possibly unsafe. Consider using discriminated unions.",
    },
    schema: [],
  },
  defaultOptions: [],
  create: context => {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      BinaryExpression: node => {
        if (node.operator !== "in") {
          return;
        }
        const tsRight = services.esTreeNodeToTSNodeMap.get(node.right);
        const tsRightType = checker.getTypeAtLocation(tsRight);
        // The check work propertly for the any and non-primitive types.
        if (isAnyType(tsRightType) || isNonPrimitiveType(tsRightType)) {
          return;
        }
        // Safe if the argument has index signatures.
        if (hasIndexSignatures(checker, tsRightType)) {
          return;
        }
        context.report({
          node,
          messageId: "noInOperator",
        });
      },
    };
  },
});
