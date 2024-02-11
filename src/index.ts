// eslint-disable-next-line @typescript-eslint/no-unused-vars -- fix TS2742 error
import type { ESLintUtils } from "@typescript-eslint/utils";
// for module augmentation
import type {} from "eslint-define-config";
import rules from "./rules";
import configs from "./configs";

export { rules, configs };
export default { rules, configs };

// NOTE: declaring module augmentation in non-index files seems to be unstable because of tree-shaking
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
