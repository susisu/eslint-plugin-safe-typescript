import { RuleTester } from "@typescript-eslint/rule-tester";
import { dedent } from "@qnighy/dedent";
import { getFixturesDir } from "../__tests__/utils.js";
import rule from "./index.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: getFixturesDir(),
      project: "./tsconfig.json",
    },
  },
});

ruleTester.run("no-unsafe-object-property-check", rule, {
  valid: [
    // OK for any and non-primitive values
    dedent`\
      declare const x: any;
      "a" in x;
    `,
    dedent`\
      declare const x: object;
      "a" in x;
    `,
    // OK for index signatures
    dedent`\
      declare const x: { [key: string]: number };
      "a" in x;
    `,
  ],
  invalid: [
    // Error if it possibly narrows type
    {
      code: dedent`\
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
      code: dedent`\
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
