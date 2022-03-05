import { ESLintUtils } from "@typescript-eslint/utils";
import rule from ".";
import { code, getFixturesDir } from "../__tests__/utils";

const ruleTester = new ESLintUtils.RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    tsconfigRootDir: getFixturesDir(),
    project: "./tsconfig.json",
  },
  parser: "@typescript-eslint/parser",
});

ruleTester.run("no-unsafe-object-enum", rule, {
  valid: [
    // OK if the argument's type has an index signature
    code`
      declare const x: { [key: string]: number };
      Object.keys(x);
    `,
    code`
      declare const x: { [key: number]: number };
      Object.keys(x);
    `,
    code`
      declare const x: { [key: symbol]: number };
      Object.keys(x);
    `,
  ],
  invalid: [
    // Error if the argument's type does not have an index signature
    {
      code: code`
        declare const x: { a: number; b: number };
        Object.keys(x);
      `,
      errors: [
        {
          messageId: "noEnumMethod",
          data: { method: "keys" },
          line: 2,
          column: 1,
        },
      ],
    },
    {
      code: code`
        declare const x: { a: number; b: number };
        Object.values(x);
      `,
      errors: [
        {
          messageId: "noEnumMethod",
          data: { method: "values" },
          line: 2,
          column: 1,
        },
      ],
    },
    {
      code: code`
        declare const x: { a: number; b: number };
        Object.entries(x);
      `,
      errors: [
        {
          messageId: "noEnumMethod",
          data: { method: "entries" },
          line: 2,
          column: 1,
        },
      ],
    },
    // Error if the argument's type has an index signature but it is not allowed by the option
    {
      code: code`
        declare const x: { [key: string]: number };
        Object.keys(x);
      `,
      options: [{ allowIndexSignatures: false }],
      errors: [
        {
          messageId: "noEnumMethod",
          data: { method: "keys" },
          line: 2,
          column: 1,
        },
      ],
    },
  ],
});
