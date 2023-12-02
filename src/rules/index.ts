// eslint-disable-next-line @typescript-eslint/no-unused-vars -- fix TS2742 error
import type { ESLintUtils } from "@typescript-eslint/utils";
import noObjectAssign from "./no-object-assign";
import noTypeAssertion from "./no-type-assertion";
import noUnsafeObjectEnumMethod from "./no-unsafe-object-enum-method";
import noUnsafeObjectPropertyCheck from "./no-unsafe-object-property-check";
import noUnsafeObjectPropertyOverwrite from "./no-unsafe-object-property-overwrite";

export default {
  "no-object-assign": noObjectAssign,
  "no-type-assertion": noTypeAssertion,
  "no-unsafe-object-enum-method": noUnsafeObjectEnumMethod,
  "no-unsafe-object-property-check": noUnsafeObjectPropertyCheck,
  "no-unsafe-object-property-overwrite": noUnsafeObjectPropertyOverwrite,
};
