// eslint-disable-next-line @typescript-eslint/no-unused-vars -- fix TS2742 error
import type { ESLintUtils } from "@typescript-eslint/utils";
import rules from "./rules";
import configs from "./configs";

export { rules, configs };
export default { rules, configs };

// NOTE: module augmentations that are not in src/index.ts could be removed due to tree-shaking
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
