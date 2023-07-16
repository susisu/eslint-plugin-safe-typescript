import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from ".";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
});

ruleTester.run("no-object-assign", rule, {
  valid: [`Object.assign`],
  invalid: [
    {
      code: `Object.assign({}, x)`,
      errors: [
        {
          messageId: "noCopying",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: `Object.assign(x)`,
      errors: [
        {
          messageId: "noMutation",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: `Object.assign(x, y)`,
      errors: [
        {
          messageId: "noMutation",
          line: 1,
          column: 1,
        },
      ],
    },
  ],
});
