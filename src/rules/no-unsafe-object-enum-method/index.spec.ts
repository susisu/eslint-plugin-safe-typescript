import { ESLintUtils } from "@typescript-eslint/utils";
import { code, getFixturesDir } from "../__tests__/utils";
import rule from ".";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: getFixturesDir(),
    project: "./tsconfig.json",
  },
});

ruleTester.run("no-unsafe-object-enum-method", rule, {
  valid: [
    // OK if all the argument's properties are known
    `Object.keys({ a: 0, b: 1, ...{ c: 2, d: 3, ...{ e: 4, f: 5 } } })`,
    // OK if the argument's type is any or non-primitive
    code`
      declare const x: any;
      Object.keys(x);
    `,
    code`
      declare const x: object;
      Object.keys(x);
    `,
    // OK if the argument's type has index signatures
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
    // Error if the argument possibly has unknown properties
    {
      code: code`
        declare const x: { foo: number; bar: number };
        Object.keys({ a: 0, b: 1, ...{ ...x, c: 1, d: 2 } });
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
      // In this case, the argument's type does not have index signatures,
      // and thus the argument has possibly unknown properties.
      code: code`
        declare const x: { [key: string]: number };
        Object.keys({ a: 0, b: 1, ...{ ...x, c: 1, d: 2 } });
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
    // Error if the argument's type does not have index signatures
    {
      code: code`
        declare const x: { foo: number; bar: number };
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
        declare const x: { foo: number; bar: number };
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
        declare const x: { foo: number; bar: number };
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
    // Error if the argument's type has index signatures but it is disallowed by the option
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
