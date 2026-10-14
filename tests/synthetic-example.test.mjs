import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Defense-in-depth check: the synthetic example must never contain a small set of known private
// terms. This is a safeguard in addition to (not a replacement for) careful authoring.
const FORBIDDEN_TERMS = ["ART4", "ART 4", "proforma", "Ream Deal Tracker"];

function listFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === ".git" || entry === "node_modules") continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) listFiles(p, out);
    else out.push(p);
  }
  return out;
}

test("synthetic example and templates contain none of the known private-project terms", () => {
  const dirsToCheck = [join(ROOT, "examples"), join(ROOT, "templates"), join(ROOT, "skills"), join(ROOT, "docs")];
  for (const dir of dirsToCheck) {
    for (const file of listFiles(dir)) {
      const text = readFileSync(file, "utf8");
      for (const term of FORBIDDEN_TERMS) {
        assert.ok(!text.includes(term), `Forbidden term "${term}" found in ${file}`);
      }
    }
  }
});
