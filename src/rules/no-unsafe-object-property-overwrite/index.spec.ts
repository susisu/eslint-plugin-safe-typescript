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

ruleTester.run("no-unsafe-object-property-overwrite", rule, {
  valid: [
    // OK at the beginning of the object literal / Object.assign()
    code`
      declare const x: { foo: number; bar: number };
      ({ ...x });
    `,
    code`
      declare const x: { foo: number; bar: number };
      Object.assign(x);
    `,
    code`
      declare const x: { foo: number; bar: number };
      ({ ...x, a: 0, b: 1 });
    `,
    code`
      declare const x: { foo: number; bar: number };
      Object.assign(x, { a: 0, b: 1 });
    `,
    // OK if all properties are known
    `({ a: 0, b: 1, ...{ c: 2, d: 3, ...{ e: 4, f: 5 } } })`,
    `Object.assign({ a: 0, b: 1 }, { c: 2, d: 3, ...{ e: 4, f: 5 } })`,
    // OK for any
    code`
      declare const x: any;
      ({ a: 0, b: 1, ...x });
    `,
    code`
      declare const x: any;
      Object.assign({ a: 0, b: 1 }, x);
    `,
    // OK if the object has only index signatures
    code`
      declare const x: { [key: string]: number };
      declare const y: { [key: string]: string };
      ({ ...x, ...y });
    `,
  ],
  invalid: [
    // Error at the middle or end of the object literal / Object.assign()
    {
      code: code`
        declare const x: { foo: number; bar: number };
        ({ a: 0, ...x, b: 1 });
      `,
      errors: [
        {
          messageId: "noSpreadSyntax",
          line: 2,
          column: 10,
        },
      ],
    },
    {
      code: code`
        declare const x: { foo: number; bar: number };
        Object.assign({ a: 0 }, x, { b: 1 })
      `,
      errors: [
        {
          messageId: "noObjectAssign",
          line: 2,
          column: 25,
        },
      ],
    },
    {
      code: code`
        declare const x: { foo: number; bar: number };
        ({ a: 0, b: 1, ...x });
      `,
      errors: [
        {
          messageId: "noSpreadSyntax",
          line: 2,
          column: 16,
        },
      ],
    },
    {
      code: code`
        declare const x: { foo: number; bar: number };
        Object.assign({ a: 0, b: 1 }, x);
      `,
      errors: [
        {
          messageId: "noObjectAssign",
          line: 2,
          column: 31,
        },
      ],
    },
    // Error if possibly contains unknown properties
    {
      code: code`
        declare const x: { foo: number; bar: number };
        ({ a: 0, b: 1, ...{ ...x, c: 1, d: 2 } });
      `,
      errors: [
        {
          messageId: "noSpreadSyntax",
          line: 2,
          column: 16,
        },
      ],
    },
    {
      code: code`
        declare const x: { foo: number; bar: number };
        Object.assign({ a: 0, b: 1 }, { ...x, c: 1, d: 2 });
      `,
      errors: [
        {
          messageId: "noObjectAssign",
          line: 2,
          column: 31,
        },
      ],
    },
    // Error if the object has only index signatures but it is disallowed by the option
    {
      code: code`
        declare const x: { [key: string]: number };
        declare const y: { [key: string]: string };
        ({ ...x, ...y });
      `,
      options: [{ allowIndexSignatures: false }],
      errors: [
        {
          messageId: "noSpreadSyntax",
          line: 3,
          column: 10,
        },
      ],
    },
  ],
});
