# @susisu/eslint-plugin-safe-typescript

[![CI](https://github.com/susisu/eslint-plugin-safe-typescript/workflows/CI/badge.svg)](https://github.com/susisu/eslint-plugin-safe-typescript/actions?query=workflow%3ACI)

An [ESLint](https://eslint.org) plugin that makes your TypeScript code safer

## Installation

This plugin requires [TypeScript](https://www.typescriptlang.org/) and [typescript-eslint](https://typescript-eslint.io/).
If you haven't installed them in your project, follow the guide on typescript-eslint's [Getting Started](https://typescript-eslint.io/getting-started) page.

Once you're ready, install this plugin:

``` shell
# npm
npm i --save-dev @susisu/eslint-plugin-safe-typescript
# yarn
yarn add -D @susisu/eslint-plugin-safe-typescript
# pnpm
pnpm add -D @susisu/eslint-plugin-safe-typescript
```

## Configuration

1. Enable typescript-eslint parser
2. Add `@susisu/eslint-plugin-safe-typescript` to plugins
3. (Optional) Add `parserOptions.project` if you enable rules that use type information.

``` js
// eslint.config.js

import tsEslint from "typescript-eslint";
import safeTsPlugin from "@susisu/eslint-plugin-safe-typescript";

export default [
  {
    languageOptions: {
      parser: tsEslint.parser, // (1)
      parserOptions: {
        project: true, // (3)
      },
    },
    plugins: {
      "@susisu/safe-typescript": safeTsPlugin, // (2)
    },
    rules: {
      "@susisu/safe-typescript/no-object-assign": "error",
    },
  },
];
```

## Recommended configuration

This plugin also provides a configuration set for the recommended rules (see [Rules](#rules) for which rules are recommended).

Since some rules in the recommended configuration require type information, `parserOptions.project` must be set in your config.

``` js
// eslint.config.js

export default [
  safeTsPlugin.configs.recommended,
  // or extend in `rules`
  // {
  //   rules: {
  //     ...safeTsPlugin.configs.recommended.rules,
  //   },
  // },
];
```

## Rules

✅ = recommended, 🔧 = fixable, 💡 = has suggestions, 💭 = requires type information

| Name | Description | ✅ | 🔧 | 💭 |
| --- | --- | --- | --- | --- |
| [`no-object-assign-mutation`](https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/no-object-assign-mutation/README.md) | Disallow mutations using `Object.assign()`. | ✅ | | |
| [`no-type-assertion`](https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/no-type-assertion/README.md) | Disallow type assertions like `x as T`. | ✅ | | |
| [`no-unsafe-object-enum-method`](https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/no-unsafe-object-enum-method/README.md) | Disallow possibly unsafe property enumeration methods of `Object`. | ✅ | | 💭 |
| [`no-unsafe-object-property-check`](https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/no-unsafe-object-property-check/README.md) | Disallow possibly unsafe property checks of object. | ✅ | | 💭 |
| [`no-unsafe-object-property-overwrite`](https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/no-unsafe-object-property-overwrite/README.md) | Disallow possibly unsafe overwrites of object properties. | ✅ | 💡 | 💭 |

## Contributing

Issues and PRs are welcome!
Feel free to open issues if you have any problems or ideas.

## License

[MIT License](http://opensource.org/licenses/mit-license.php)

## Author

Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
