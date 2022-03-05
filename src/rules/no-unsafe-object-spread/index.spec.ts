import { ESLintUtils } from "@typescript-eslint/utils";
import rule from ".";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
});

ruleTester.run("no-unsafe-object-spread", rule, {
  valid: [
    // OK at the beginning of the object literal
    `const x = { ...y }`,
    `const x = { ...y, a: 0, b: 1 }`,
    // OK if all properties are known
    `const x = { a: 0, b: 1, ...{ c: 2, d: 3 } }`,
    `const x = { a: 0, b: 1, ...{ c: 2, d: 3, ...{ e: 4, f: 5 } } }`,
    // OK in arrays or function calls
    `const x = [0, 1, ...y]`,
    `const x = f(0, 1, ...y)`,
  ],
  invalid: [
    // Error at the middle or end of the object literal
    {
      code: `const x = { a: 0, ...y, b: 1 }`,
      errors: [
        {
          messageId: "possiblyUnsafe",
          line: 1,
          column: 19,
        },
      ],
    },
    {
      code: `const x = { a: 0, b: 1, ...y }`,
      errors: [
        {
          messageId: "possiblyUnsafe",
          line: 1,
          column: 25,
        },
      ],
    },
    // Error if possibly contains unknown properties
    {
      code: `const x = { a: 0, b: 1, ...{ ...y, c: 1, d: 2 } }`,
      errors: [
        {
          messageId: "possiblyUnsafe",
          line: 1,
          column: 25,
        },
      ],
    },
  ],
});
