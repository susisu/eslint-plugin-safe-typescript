## 0.10.0 (2025-06-07)

- Upgrade dependencies
- Add suggestion fixer for `no-unsafe-object-property-overwrite`
- Add `no-object-assign-mutation` rule, which replaces `no-object-assign`
- Deprecate `no-object-assign` rule
  - Use `no-object-assign-mutation` and [`prefer-object-spread`](https://eslint.org/docs/latest/rules/prefer-object-spread) instead
- **BREAKING** The package is now Pure ESM
- **BREAKING** Update recommended config
  - Replace `no-object-assign` with `no-object-assign-mutation`
- **BREAKING** Remove [`eslint-define-config`](https://github.com/eslint-types/eslint-define-config) support

## 0.9.4 (2025-04-29)

- Upgrade dependencies

## 0.9.3 (2025-02-09)

- Upgrade dependencies

## 0.9.2 (2024-11-23)

- Upgrade dependencies

## 0.9.1 (2024-10-26)

- Upgrade dependencies
- Add name for the recommended config
- Fix ordering in the `exports` field of `package.json`

## 0.9.0 (2024-08-04)

- **BREAKING** The minimum supported version of typescript-eslint is now `8.0.0`
- Upgrade typescript-eslint to v8

## 0.8.3 (2024-07-08)

- Upgrade dependencies

## 0.8.2 (2024-06-20)

- Fix CJS interop issue

## 0.8.1 (2024-06-19)

- `no-unsafe-object-property-overwrite`: Fix false positive for conditionals
- Upgrade dependencies

## 0.8.0 (2024-03-16)

- Upgrade typescript-eslint to 7.2.x to support TypeScript 5.4
- Change how the plugin and its type are exported to improve compatibility with `@types/eslint`
  - Shortly, the plugin type is now compatible with `ESLint.Plugin`
- Move [`eslint-define-config`](https://github.com/eslint-types/eslint-define-config) support to a submodule `@susisu/eslint-plugin-safe-typescript/define-config-support`

## 0.7.0 (2024-02-15)

- Upgrade typescript-eslint to v7
- `no-type-assertion`: Add support for angle bracket style type assertions like `<T>x`

## 0.6.1 (2024-02-11)

- Refactor how the module augmentation for eslint-define-config is exported

## 0.6.0 (2024-02-11)

- Provide rule option types for [`eslint-define-config`](https://github.com/eslint-types/eslint-define-config)

## 0.5.3 (2024-02-10)

- Upgrade dependencies
- Add docs for flat config

## 0.5.2 (2023-12-16)

- Add default export for ESM

## 0.5.1 (2023-12-03)

- Fix `types` were missing in the `exports` field

## 0.5.0 (2023-12-03)

- **BREAKING** Drop support for Node.js 16
- Type declarations are now included again
  - It would never be used in the previous config format (`.eslintrc`), but will be useful in the new flat config format.
- The package is now ESM/CJS dual
- Upgrade dependencies

## 0.4.1 (2023-07-16)

- Fix peerDependencies was not updated

## 0.4.0 (2023-07-16)

- Upgrade typescript to 5.1
- **BREAKING** Upgrade typescript-eslint to 6.0
- **BREAKING** Type declarations are no longer included in the distribution

## 0.3.5 (2023-03-17)

- Upgrade dependencies
  - Upgrade TypeScript to 5.0

## 0.3.4 (2022-12-04)

- Upgrade TypeScript to 4.9

## 0.3.3 (2022-10-02)

- Upgrade dependencies
- Update message of `no-type-assertion`

## 0.3.2 (2022-09-02)

- Upgrade dependencies

## 0.3.1 (2022-08-11)

- Upgrade dependencies

## 0.3.0 (2022-07-13)

- Add `no-type-assertion` rule
- **BREAKING** Add `no-type-assertion` rule to the recommended config

## 0.2.2 (2022-05-06)

- Upgrade dependencies

## 0.2.1 (2022-03-21)

- Fix `no-object-assign` was not exported

## 0.2.0 (2022-03-21)

- Add `allowIndexSignatures` option to `no-unsafe-object-property-overwrite` rule
- Add `no-object-assign` rule
- **BREAKING** Add `no-object-assign` rule to the recommended config

## 0.1.0 (2022-03-06)

- First release
