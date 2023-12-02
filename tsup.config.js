import { defineConfig } from "tsup";

export default defineConfig({
  tsconfig: "./tsconfig.build.json",
  entry: ["src/index.ts"],
  outDir: "./lib",
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: true,
  // See https://github.com/typescript-eslint/typescript-eslint/issues/5032
  dts: false,
  clean: true,
});
