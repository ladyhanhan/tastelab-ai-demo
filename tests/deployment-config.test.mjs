import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Vercel keeps dependency manifests for API function bundling", async () => {
  const ignoredEntries = (await readFile(".vercelignore", "utf8"))
    .split(/\r?\n/u)
    .map((entry) => entry.trim())
    .filter(Boolean);

  assert.equal(ignoredEntries.includes("package.json"), false);
  assert.equal(ignoredEntries.includes("package-lock.json"), false);
});
