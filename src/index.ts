import type { ESLint } from "eslint";
import rules from "./rules/index.js";
import configs from "./configs/index.js";

const plugin = {
  rules,
  configs,
} satisfies ESLint.Plugin;

export default plugin;
export { rules, configs };
