import type { ESLint } from "eslint";
import recommended from "./recommended.js";

const configs = {
  recommended,
} satisfies ESLint.Plugin["configs"];

export default configs;
