import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from ".";

const ruleTester = new RuleTester();

ruleTester.run("no-type-assertion", rule, {
  valid: [
    `const x = { foo: 42 } as const`,
    `const x = { foo: 42 } as unknown`,
    `const x = { foo: 42 } as any`,
    `const x = <const>{ foo: 42 }`,
    `const x = <unknown>{ foo: 42 }`,
    `const x = <any>{ foo: 42 }`,
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
    {
      code: `const x = <{ foo: number; bar: number }>{ foo: 42 }`,
      errors: [
        {
          messageId: "noTypeAssertion",
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: `const x = <never>{ foo: 42 }`,
      errors: [
        {
          messageId: "noTypeAssertion",
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: `const x = <{ foo: number }>{ foo: 42 }`,
      errors: [
        {
          messageId: "noTypeAssertion",
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: `const x = <{}>{ foo: 42 }`,
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
