#!/usr/bin/env node
import { pathToFileURL } from "node:url";
/**
 * Minimal, dependency-free Markdown -> HTML renderer covering headings, paragraphs, lists,
 * code fences, links, bold/italic, and tables. Intentionally conservative: it does not attempt
 * full CommonMark compliance, only enough to produce valid, well-formed HTML for the structured
 * documents this toolkit generates. Verified by tests/render.test.mjs.
 */
export function renderMarkdownToHtml(md) {
  const lines = md.split("\n");
  let html = "";
  let inCode = false;
  let inList = false;
  let inTable = false;
  let tableRow = 0;

  const inline = (text) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  const closeList = () => { if (inList) { html += "</ul>\n"; inList = false; } };
  const closeTable = () => { if (inTable) { html += "</table>\n"; inTable = false; tableRow = 0; } };

  for (const raw of lines) {
    const line = raw;
    if (line.trim().startsWith("```")) {
      closeList(); closeTable();
      html += inCode ? "</code></pre>\n" : "<pre><code>";
      inCode = !inCode;
      continue;
    }
    if (inCode) { html += inline(line) + "\n"; continue; }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      closeList(); closeTable();
      const level = heading[1].length;
      html += `<h${level}>${inline(heading[2])}</h${level}>\n`;
      continue;
    }

    const listItem = /^[-*]\s+(.*)$/.exec(line);
    if (listItem) {
      closeTable();
      if (!inList) { html += "<ul>\n"; inList = true; }
      html += `<li>${inline(listItem[1])}</li>\n`;
      continue;
    }
    closeList();

    const tableLine = /^\|(.+)\|$/.exec(line.trim());
    if (tableLine) {
      const cells = tableLine[1].split("|").map((c) => c.trim());
      if (cells.every((c) => /^-+$/.test(c))) continue; // separator row
      if (!inTable) { html += "<table>\n"; inTable = true; tableRow = 0; }
      const tag = tableRow === 0 ? "th" : "td";
      html += `<tr>${cells.map((c) => `<${tag}>${inline(c)}</${tag}>`).join("")}</tr>\n`;
      tableRow++;
      continue;
    }
    closeTable();

    if (line.trim() === "") { html += "\n"; continue; }
    html += `<p>${inline(line)}</p>\n`;
  }
  closeList(); closeTable();
  if (inCode) html += "</code></pre>\n";

  return `<!DOCTYPE html>\n<html><head><meta charset="utf-8"></head><body>\n${html}</body></html>\n`;
}

async function main() {
  const [inPath, outPath] = process.argv.slice(2);
  if (!inPath) {
    console.error("Usage: node render-markdown-to-html.mjs <input.md> [output.html]");
    process.exit(1);
  }
  const fs = await import("node:fs");
  const md = fs.readFileSync(inPath, "utf8");
  const html = renderMarkdownToHtml(md);
  if (outPath) fs.writeFileSync(outPath, html);
  else console.log(html);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
