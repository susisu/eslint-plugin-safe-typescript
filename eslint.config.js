import { config, map } from "@susisu/eslint-config";
import prettierConfig from "eslint-config-prettier";
import eslintPluginPlugin from "eslint-plugin-eslint-plugin";
import vitestPlugin from "eslint-plugin-vitest";
import globals from "globals";

export default [
  ...map({ files: ["src/**/*.ts"] }, [
    config.tsTypeChecked(),
    {
      plugins: {
        "eslint-plugin": eslintPluginPlugin,
      },
      languageOptions: {
        sourceType: "module",
        parserOptions: {
          project: "./tsconfig.json",
        },
        globals: {
          ...globals.es2021,
          ...globals.node,
        },
      },
      rules: {
        ...eslintPluginPlugin.configs.recommended.rules,
      },
    },
  ]),
  ...map({ files: ["src/**/*.spec.ts", "src/**/__tests__/**/*.ts"] }, [
    {
      plugins: {
        vitest: vitestPlugin,
      },
      languageOptions: {
        globals: {
          ...vitestPlugin.environments.env.globals,
        },
      },
      rules: {
        ...vitestPlugin.configs.recommended.rules,
      },
    },
  ]),
  ...map({ files: ["*.js"] }, [
    config.js(),
    {
      languageOptions: {
        sourceType: "module",
        globals: {
          ...globals.es2021,
          ...globals.node,
        },
      },
    },
  ]),
  prettierConfig,
];
