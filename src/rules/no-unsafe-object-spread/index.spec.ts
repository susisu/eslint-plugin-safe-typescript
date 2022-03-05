import { ESLintUtils } from "@typescript-eslint/utils";
import rule from ".";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
});

ruleTester.run("no-unsafe-object-spread", rule, {
  valid: [
    // OK at the beginning of the object literal
    `({ ...x })`,
    `({ ...x, a: 0, b: 1 })`,
    // OK if all properties are known
    `({ a: 0, b: 1, ...{ c: 2, d: 3, ...{ e: 4, f: 5 } } })`,
    // OK in arrays or function calls
    `[0, 1, ...x]`,
    `f(0, 1, ...x)`,
  ],
  invalid: [
    // Error at the middle or end of the object literal
    {
      code: `({ a: 0, ...x, b: 1 })`,
      errors: [
        {
          messageId: "possiblyUnsafe",
          line: 1,
          column: 10,
        },
      ],
    },
    {
      code: `({ a: 0, b: 1, ...x })`,
      errors: [
        {
          messageId: "possiblyUnsafe",
          line: 1,
          column: 16,
        },
      ],
    },
    // Error if possibly contains unknown properties
    {
      code: `({ a: 0, b: 1, ...{ ...x, c: 1, d: 2 } })`,
      errors: [
        {
          messageId: "possiblyUnsafe",
          line: 1,
          column: 16,
        },
      ],
    },
  ],
});
