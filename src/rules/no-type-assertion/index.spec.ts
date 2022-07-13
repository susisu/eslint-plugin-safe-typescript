import { ESLintUtils } from "@typescript-eslint/utils";
import rule from ".";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
});

ruleTester.run("no-type-assertion", rule, {
  valid: [
    `const x = { foo: 42 } as const`,
    `const x = { foo: 42 } as unknown`,
    `const x = { foo: 42 } as any`,
  ],
  invalid: [
    {
      code: `const x = { foo: 42 } as { foo: number; bar: number }`,
      errors: [
        {
          messageId: "noTypeAssertion",
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: `const x = { foo: 42 } as never`,
      errors: [
        {
          messageId: "noTypeAssertion",
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: `const x = { foo: 42 } as { foo: number }`,
      errors: [
        {
          messageId: "noTypeAssertion",
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: `const x = { foo: 42 } as {}`,
      errors: [
        {
          messageId: "noTypeAssertion",
          line: 1,
          column: 11,
        },
      ],
    },
  ],
});
