import path from "path";
import { stripIndent } from "common-tags";

export function getFixturesDir(): string {
  return path.join(__dirname, "fixtures");
}

export function code(strings: TemplateStringsArray, ...values: unknown[]): string {
  return stripIndent(strings, ...values);
}
