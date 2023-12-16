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
