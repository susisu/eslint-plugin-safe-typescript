import { config } from "@susisu/eslint-config";
import eslintPluginPlugin from "eslint-plugin-eslint-plugin";
import vitestPlugin from "@vitest/eslint-plugin";
import globals from "globals";

export default config({ tsconfigRootDir: import.meta.dirname }, [
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
        ...globals.es2023,
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
        ...globals.es2023,
        ...globals.node,
      },
    },
  },
]);
