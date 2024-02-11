// NOTE: module augmentation in src/index.ts depends on this import statement to exist
import type { FlatESLintConfig } from "eslint-define-config";

const config: Pick<FlatESLintConfig, "rules"> = {
  rules: {
    "@susisu/safe-typescript/no-object-assign": "error",
    "@susisu/safe-typescript/no-type-assertion": "error",
    "@susisu/safe-typescript/no-unsafe-object-enum-method": "error",
    "@susisu/safe-typescript/no-unsafe-object-property-check": "error",
    "@susisu/safe-typescript/no-unsafe-object-property-overwrite": "error",
  },
};

export default config;
