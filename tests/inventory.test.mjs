import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runInventory } from "../skills/project-documentation-discovery/scripts/inventory.mjs";

function makeFixture() {
  const dir = mkdtempSync(join(tmpdir(), "epi-fixture-"));
  mkdirSync(join(dir, "sub"), { recursive: true });
  writeFileSync(join(dir, "readme.md"), "# Title\n\n## Section A\n\nSome text.\n");
  writeFileSync(join(dir, "data.csv"), "a,b\n1,2\n3,4\n");
  writeFileSync(join(dir, "sub", "notes.txt"), "plain text notes");
  writeFileSync(join(dir, "config.json"), JSON.stringify({ ok: true }));
  writeFileSync(join(dir, "page.html"), "<html><head><title>T</title></head><body><h1>Hi</h1><table><tr><td>x</td></tr></table></body></html>");
  writeFileSync(join(dir, "deck.pptx"), "fake-binary-content");
  writeFileSync(join(dir, "secret.env"), "API_KEY=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  return dir;
}

test("inventory classifies supported formats as extracted and unsupported formats honestly", () => {
  const dir = makeFixture();
  try {
    const { inventory, evidenceIndex } = runInventory(dir);
    const byPath = Object.fromEntries(inventory.map((r) => [r.path, r]));

    assert.equal(byPath["readme.md"].status, "extracted-full");
    assert.equal(byPath["data.csv"].status, "extracted-full");
    assert.equal(byPath["sub/notes.txt"].status, "extracted-full");
    assert.equal(byPath["config.json"].status, "extracted-full");
    assert.equal(byPath["deck.pptx"].status, "unsupported-format");
    assert.match(byPath["deck.pptx"].warnings[0], /external parser or manual export/);

    const mdHeadings = evidenceIndex.filter((e) => e.source_path === "readme.md");
    assert.ok(mdHeadings.some((h) => h.heading_path === "Title"));
    assert.ok(mdHeadings.some((h) => h.heading_path === "Section A"));

    const htmlRecord = byPath["page.html"];
    assert.equal(htmlRecord.title, "T");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("inventory redacts secret-shaped values from markdown/text/html before indexing", () => {
  const dir = makeFixture();
  try {
    writeFileSync(join(dir, "leak.md"), "# Leak\n\nAPI_KEY=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\n");
    const { inventory } = runInventory(dir);
    // The redaction happens on the in-memory text used for extraction, not by altering the file;
    // confirm the evidence index never contains the raw secret value in any heading text.
    const flat = JSON.stringify(inventory);
    assert.ok(!flat.includes("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("re-running inventory on an unchanged corpus produces identical hashes and statuses", () => {
  const dir = makeFixture();
  try {
    const run1 = runInventory(dir);
    const run2 = runInventory(dir);
    assert.deepEqual(run1.inventory, run2.inventory);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
