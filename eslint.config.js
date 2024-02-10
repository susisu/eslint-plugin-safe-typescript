import { make } from "@susisu/eslint-config";
import eslintPluginPlugin from "eslint-plugin-eslint-plugin";
import vitestPlugin from "eslint-plugin-vitest";
import globals from "globals";

export default make({}, [
  {
    plugins: {
      "eslint-plugin": eslintPluginPlugin,
      vitest: vitestPlugin,
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      ...eslintPluginPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["src/**/*.spec.ts", "src/**/__tests__/**/*.ts"],
    languageOptions: {
      globals: {
        ...vitestPlugin.environments.env.globals,
      },
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["*.js"],
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
  },
]);
