import type { ESLint } from "eslint";
import rules from "./rules";
import configs from "./configs";

const plugin = {
  rules,
  configs,
} satisfies ESLint.Plugin;

export default plugin;
export { rules, configs };
