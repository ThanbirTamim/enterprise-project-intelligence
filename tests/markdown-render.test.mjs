import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdownToHtml } from "../skills/technical-document-generator/scripts/render-markdown-to-html.mjs";

function assertTagsBalanced(html, tag) {
  const opens = (html.match(new RegExp(`<${tag}(\\s[^>]*)?>`, "g")) || []).length;
  const closes = (html.match(new RegExp(`</${tag}>`, "g")) || []).length;
  assert.equal(opens, closes, `${tag} open/close mismatch: ${opens} vs ${closes}`);
}

test("renders headings, lists, tables, and code fences with balanced tags", () => {
  const md = [
    "# Title",
    "",
    "## Section",
    "",
    "- one",
    "- two",
    "",
    "| a | b |",
    "|---|---|",
    "| 1 | 2 |",
    "",
    "```",
    "code line",
    "```",
    "",
    "Normal paragraph with **bold** and *italic* and `code`.",
  ].join("\n");

  const html = renderMarkdownToHtml(md);
  for (const tag of ["h1", "h2", "ul", "li", "table", "tr", "pre", "p", "strong", "em", "code"]) {
    assertTagsBalanced(html, tag);
  }
  assert.ok(html.includes("<h1>Title</h1>"));
  assert.ok(html.includes("<h2>Section</h2>"));
  assert.ok(html.startsWith("<!DOCTYPE html>"));
});

test("escapes HTML special characters in content", () => {
  const html = renderMarkdownToHtml("Value is < 5 & > 2");
  assert.ok(html.includes("&lt; 5 &amp; &gt; 2"));
});
