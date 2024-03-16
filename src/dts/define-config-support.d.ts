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

export {};
