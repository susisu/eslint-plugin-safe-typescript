import type { ESLint } from "eslint";
import rules from "./rules";
import configs from "./configs";

const plugin = {
  rules,
  configs,
} satisfies ESLint.Plugin;

export default plugin;

import type {} from "eslint-define-config";

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
