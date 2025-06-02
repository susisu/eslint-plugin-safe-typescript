import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from ".";

const ruleTester = new RuleTester();

ruleTester.run("no-object-assign-mutation", rule, {
  valid: [`Object.assign`, `Object.assign({}, x)`, `Object.assign(x)`],
  invalid: [
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
