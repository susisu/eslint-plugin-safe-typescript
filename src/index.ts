// eslint-disable-next-line @typescript-eslint/no-unused-vars -- fix TS2742 error
import type { ESLintUtils } from "@typescript-eslint/utils";
import rules from "./rules";
import configs from "./configs";

export { rules, configs };
export default { rules, configs };

// Declaring module augmentation is very unstable due to tree-shaking.
// To avoid `import` and `declare` statements from being removed,
// 1. export something from `eslint-define-config` (anything will be ok)
// 2. declare in the index file (declarations in non-index files will be removed in some cases)
import type { CustomRuleOptions } from "eslint-define-config";

/** @deprecated Never use this. */
type Never = CustomRuleOptions extends 0 ? unknown : never;

export { Never as __internal__never };

declare module "eslint-define-config" {
  export interface CustomRuleOptions {
    "@susisu/safe-typescript/no-object-assign": [];
    "@susisu/safe-typescript/no-type-assertion": [];
    "@susisu/safe-typescript/no-unsafe-object-enum-method": [
      {
        allowIndexSignatures?: boolean;
      },
    ];
    "@susisu/safe-typescript/no-unsafe-object-property-check": [];
    "@susisu/safe-typescript/no-unsafe-object-property-overwrite": [
      {
        allowIndexSignatures?: boolean;
      },
    ];
  }
}
