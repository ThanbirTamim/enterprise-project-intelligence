import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runReleaseAudit } from "../scripts/release-audit.mjs";

test("flags a fake secret-shaped value and a local-user path without printing the raw value", async () => {
  const dir = mkdtempSync(join(tmpdir(), "epi-audit-fixture-"));
  try {
    writeFileSync(
      join(dir, "sample.env"),
      "API_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
        "# generated at /Users/exampleuser/private/notes.txt\n"
    );
    const result = await runReleaseAudit(dir);
    assert.ok(result.findings.some((f) => f.category.startsWith("secret-like:")));
    assert.ok(result.findings.some((f) => f.category.startsWith("local-path:")));

    const serialized = JSON.stringify(result);
    assert.ok(!serialized.includes("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
    assert.ok(!serialized.includes("/Users/exampleuser/"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a clean fixture with no secrets or local paths produces no findings", async () => {
  const dir = mkdtempSync(join(tmpdir(), "epi-audit-clean-"));
  try {
    writeFileSync(join(dir, "readme.md"), "# Clean file\n\nNothing sensitive here.\n");
    const result = await runReleaseAudit(dir);
    assert.equal(result.findings.length, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
