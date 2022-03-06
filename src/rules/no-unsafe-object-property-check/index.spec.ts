import { ESLintUtils } from "@typescript-eslint/utils";
import { code, getFixturesDir } from "../__tests__/utils";
import rule from ".";

const ruleTester = new ESLintUtils.RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    tsconfigRootDir: getFixturesDir(),
    project: "./tsconfig.json",
  },
  parser: "@typescript-eslint/parser",
});

ruleTester.run("no-unsafe-object-property-check", rule, {
  valid: [
    // OK for any and non-primitive values
    code`
      declare const x: any;
      "a" in x;
    `,
    code`
      declare const x: object;
      "a" in x;
    `,
    // OK for index signatures
    code`
      declare const x: { [key: string]: number };
      "a" in x;
    `,
  ],
  invalid: [
    // Error if it possibly narrows type
    {
      code: code`
        declare const x: { a: number } | { b: string };
        "a" in x;
      `,
      errors: [
        {
          messageId: "noInOperator",
          line: 2,
          column: 1,
        },
      ],
    },
    {
      code: code`
        declare const x: { a: number } | { b: string } | { [key: string]: number };
        "a" in x;
      `,
      errors: [
        {
          messageId: "noInOperator",
          line: 2,
          column: 1,
        },
      ],
    },
  ],
});
