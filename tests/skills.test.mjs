import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";
import { validateSkills } from "../scripts/lib/skills.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("every skill passes structural validation with no errors", () => {
  const issues = validateSkills(ROOT);
  const errors = issues.filter((i) => i.level === "error");
  if (errors.length) console.error(errors);
  assert.equal(errors.length, 0, JSON.stringify(errors, null, 2));
});

test("exactly ten skills are present", () => {
  const dirs = readdirSync(resolve(ROOT, "skills"));
  assert.equal(dirs.length, 10, `expected 10 skills, found ${dirs.length}: ${dirs.join(", ")}`);
});
