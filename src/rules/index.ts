import type { ESLint, Rule } from "eslint";
import noObjectAssign from "./no-object-assign";
import noObjectAssignMutation from "./no-object-assign-mutation";
import noTypeAssertion from "./no-type-assertion";
import noUnsafeObjectEnumMethod from "./no-unsafe-object-enum-method";
import noUnsafeObjectPropertyCheck from "./no-unsafe-object-property-check";
import noUnsafeObjectPropertyOverwrite from "./no-unsafe-object-property-overwrite";

function asRuleModule(rule: unknown): Rule.RuleModule {
  // eslint-disable-next-line @susisu/safe-typescript/no-type-assertion
  return rule as Rule.RuleModule;
}

const rules = {
  "no-object-assign": asRuleModule(noObjectAssign),
  "no-object-assign-mutation": asRuleModule(noObjectAssignMutation),
  "no-type-assertion": asRuleModule(noTypeAssertion),
  "no-unsafe-object-enum-method": asRuleModule(noUnsafeObjectEnumMethod),
  "no-unsafe-object-property-check": asRuleModule(noUnsafeObjectPropertyCheck),
  "no-unsafe-object-property-overwrite": asRuleModule(noUnsafeObjectPropertyOverwrite),
} satisfies ESLint.Plugin["rules"];

export default rules;
