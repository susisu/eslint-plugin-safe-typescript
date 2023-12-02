import path from "node:path";

export function getFixturesDir(): string {
  return path.join(__dirname, "fixtures");
}
