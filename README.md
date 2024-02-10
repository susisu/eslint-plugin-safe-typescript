# @susisu/eslint-plugin-safe-typescript

[![CI](https://github.com/susisu/eslint-plugin-safe-typescript/workflows/CI/badge.svg)](https://github.com/susisu/eslint-plugin-safe-typescript/actions?query=workflow%3ACI)

ESLint plugin that makes your TypeScript code safer

## Installation

This plugin requires `typescript` and `@typescript-eslint/parser` as peer dependencies, so install them if you don't have them installed yet.

``` shell
# npm
npm i --save-dev typescript @typescript-eslint/parser
# yarn
yarn add -D typescript @typescript-eslint/parser
# pnpm
pnpm add -D typescript @typescript-eslint/parser
```

Then install the plugin.

``` shell
# npm
npm i --save-dev @susisu/eslint-plugin-safe-typescript
# yarn
yarn add -D @susisu/eslint-plugin-safe-typescript
# pnpm
pnpm add -D @susisu/eslint-plugin-safe-typescript
```

## Usage

Enable `@typescript-eslint/parser` and add `@susisu/eslint-plugin-safe-typescript` to plugins.
In addition, `parserOptions.project` is required for rules that use type information.

`.eslintrc`

``` json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": ["@susisu/safe-typescript"],
  "rules": {
    "@susisu/safe-typescript/no-object-assign": "error"
  }
}
```

`eslint.config.js`

``` js
import tsEslintParser from "@typescript-eslint/parser";
import safeTsPlugin from "@susisu/eslint-plugin-safe-typescript";

export default [
  {
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      "safe-typescript": safeTsPlugin,
    },
    rules: {
      "safe-typescript/no-object-assign": "error",
    },
  },
];
```

## Recommended configuration

The plugin provides a configuration set for the recommended rules (see [Rules](#rules) for which rules are recommended).

Since some rules in the recommended configuration require type information, `parserOptions.project` must be set.

`eslintrc`

``` json
{
  "extends": ["plugin:@susisu/safe-typescript/recommended"]
}
```

`eslint.config.js`

``` js
export default [
  safeTsPlugin.configs.recommended,
  // or extend in rules
  // {
  //   rules: {
  //     ...safeTsPlugin.configs.recommended.rules,
  //   },
  // },
];
```

## Rules

✅ = recommended, 🔧 = fixable, 💭 = requires type information

| Name | Description | ✅ | 🔧 | 💭 |
| --- | --- | --- | --- | --- |
| [`no-object-assign`](https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/no-object-assign/README.md) | Disallow the use of `Object.assign()`. | ✅ | | |
| [`no-type-assertion`](https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/no-type-assertion/README.md) | Disallow type assertions like `x as T`. | ✅ | | |
| [`no-unsafe-object-enum-method`](https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/no-unsafe-object-enum-method/README.md) | Disallow possibly unsafe property enumeration methods of `Object`. | ✅ | | 💭 |
| [`no-unsafe-object-property-check`](https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/no-unsafe-object-property-check/README.md) | Disallow possibly unsafe property checks of object. | ✅ | | 💭 |
| [`no-unsafe-object-property-overwrite`](https://github.com/susisu/eslint-plugin-safe-typescript/blob/main/src/rules/no-unsafe-object-property-overwrite/README.md) | Disallow possibly unsafe overwrites of object properties. | ✅ | | 💭 |

## Contributing

Issues and PRs are welcome!
Feel free to open issues if you have any problems or ideas.

## License

[MIT License](http://opensource.org/licenses/mit-license.php)

## Author

Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
