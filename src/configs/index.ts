import type { Linter } from "eslint";
import recommended from "./recommended.js";

const configs: {
  recommended: Linter.Config;
} = {
  recommended,
};

export default configs;
