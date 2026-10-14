#!/usr/bin/env node
/**
 * Reference documentation-discovery inventory tool.
 *
 * Walks a corpus directory and produces inventory.json + evidence-index.json using only
 * built-in Node.js capabilities. Formats that genuinely require an external parser (DOCX,
 * PPTX, PDF, Keynote, Pages, images) are honestly reported as "unsupported-format" rather
 * than silently skipped or falsely claimed as extracted.
 *
 * Usage:
 *   node inventory.mjs <corpusPath> [--out <dir>] [--exclude <glob>,<glob>...]
 */
import { pathToFileURL } from "node:url";
import { readFileSync, statSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";
import { createHash } from "node:crypto";

const DEFAULT_EXCLUDES = [".git", "node_modules", ".DS_Store", "dist", "dist-tests", ".idea"];

const TEXT_LIKE_SOURCE_EXT = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".java", ".go", ".rb", ".sql",
  ".c", ".cpp", ".h", ".hpp", ".cs", ".php", ".sh", ".env", ".ini", ".toml", ".conf",
]);

const UNSUPPORTED_BINARY_EXT = new Set([
  ".docx", ".pptx", ".pdf", ".key", ".pages", ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp",
]);

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function slug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);
}

function redactSecrets(text) {
  return text
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, "[REDACTED-PRIVATE-KEY]")
    .replace(/[A-Za-z0-9_\-]{32,}/g, (m) => (/^[A-F0-9]+$/i.test(m) && m.length === 32 ? m : "[REDACTED-TOKEN-LIKE-VALUE]"));
}

function walk(dir, excludes, out = []) {
  for (const entry of readdirSync(dir)) {
    if (excludes.includes(entry)) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, excludes, out);
    else out.push(p);
  }
  return out;
}

function extractMarkdownOrText(raw, isMarkdown) {
  const headings = [];
  if (isMarkdown) {
    const lines = raw.split("\n");
    for (const line of lines) {
      const m = /^(#{1,6})\s+(.*)$/.exec(line);
      if (m) headings.push({ level: m[1].length, text: m[2].trim(), slug: slug(m[2]) });
    }
  }
  const title = headings[0]?.text ?? null;
  return { title, headings };
}

function extractHtml(raw) {
  const headings = [];
  const headingRe = /<h([1-6])[^>]*>(.*?)<\/h\1>/gis;
  let m;
  while ((m = headingRe.exec(raw))) {
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    headings.push({ level: Number(m[1]), text, slug: slug(text) });
  }
  const tableCount = (raw.match(/<table/gi) || []).length;
  const titleMatch = /<title[^>]*>(.*?)<\/title>/is.exec(raw);
  return { title: titleMatch ? titleMatch[1].trim() : headings[0]?.text ?? null, headings, tableCount };
}

function extractCsv(raw) {
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const header = lines[0]?.split(",") ?? [];
  return { title: null, rowCount: Math.max(lines.length - 1, 0), columns: header };
}

function classify(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === ".md" || ext === ".markdown") return "markdown";
  if (ext === ".txt") return "text";
  if (ext === ".json") return "json";
  if (ext === ".yml" || ext === ".yaml") return "yaml";
  if (ext === ".csv") return "csv";
  if (ext === ".html" || ext === ".htm") return "html";
  if (TEXT_LIKE_SOURCE_EXT.has(ext)) return "source-code";
  if (UNSUPPORTED_BINARY_EXT.has(ext)) return "unsupported-binary";
  return "unknown";
}

export function runInventory(corpusPath, { excludes = [] } = {}) {
  const allExcludes = [...DEFAULT_EXCLUDES, ...excludes];
  const files = walk(corpusPath, allExcludes);
  const inventory = [];
  const evidenceIndex = [];

  for (const absPath of files) {
    const relPath = relative(corpusPath, absPath).split("\\").join("/");
    const kind = classify(absPath);
    let buf;
    try {
      buf = readFileSync(absPath);
    } catch (err) {
      inventory.push({ path: relPath, type: kind, title: null, status: "extraction-failed", hash: null, warnings: [String(err.message)] });
      continue;
    }
    const hash = sha256(buf);
    const record = { path: relPath, type: kind, title: null, status: "not-yet-processed", hash, warnings: [] };

    try {
      if (kind === "markdown" || kind === "text") {
        const raw = redactSecrets(buf.toString("utf8"));
        const { title, headings } = extractMarkdownOrText(raw, kind === "markdown");
        record.title = title ?? basename(relPath);
        record.status = "extracted-full";
        for (const h of headings) {
          evidenceIndex.push({ source_path: relPath, source_location: `${relPath}#${h.slug}`, heading_path: h.text, evidence_type: "text", level: h.level });
        }
      } else if (kind === "json") {
        JSON.parse(buf.toString("utf8"));
        record.title = basename(relPath);
        record.status = "extracted-full";
        evidenceIndex.push({ source_path: relPath, source_location: `${relPath}#root`, heading_path: "(structured data)", evidence_type: "structured-data" });
      } else if (kind === "yaml") {
        record.title = basename(relPath);
        record.status = "extracted-full";
        evidenceIndex.push({ source_path: relPath, source_location: `${relPath}#root`, heading_path: "(structured data)", evidence_type: "structured-data" });
      } else if (kind === "csv") {
        const raw = buf.toString("utf8");
        const { rowCount, columns } = extractCsv(raw);
        record.title = basename(relPath);
        record.status = "extracted-full";
        evidenceIndex.push({ source_path: relPath, source_location: `${relPath}#table`, heading_path: `table (${rowCount} rows, columns: ${columns.join("|")})`, evidence_type: "table" });
      } else if (kind === "html") {
        const raw = redactSecrets(buf.toString("utf8"));
        const { title, headings, tableCount } = extractHtml(raw);
        record.title = title ?? basename(relPath);
        record.status = headings.length || tableCount ? "extracted-partial" : "extracted-full";
        if (headings.length === 0 && tableCount === 0) {
          // no structure found at all; still a successful text pass
        } else {
          record.warnings.push("HTML extraction captures headings and tables only; layout, scripts, and embedded visuals are not evaluated.");
        }
        for (const h of headings) {
          evidenceIndex.push({ source_path: relPath, source_location: `${relPath}#${h.slug}`, heading_path: h.text, evidence_type: "text", level: h.level });
        }
      } else if (kind === "source-code") {
        record.title = basename(relPath);
        record.status = "extracted-full";
        record.warnings.push("Treated as raw text for reverse-engineering purposes; no language-aware parsing performed.");
      } else if (kind === "unsupported-binary") {
        record.status = "unsupported-format";
        record.warnings.push(`Format ${extname(relPath)} requires an external parser or manual export (see references/format-matrix.md). Catalogued by filename only.`);
      } else {
        record.status = "unsupported-format";
        record.warnings.push("Unknown/unclassified file type; catalogued by filename only.");
      }
    } catch (err) {
      record.status = "extraction-failed";
      record.warnings.push(String(err.message));
    }

    inventory.push(record);
  }

  return { inventory, evidenceIndex };
}

function main() {
  const [corpusPath, ...rest] = process.argv.slice(2);
  if (!corpusPath) {
    console.error("Usage: node inventory.mjs <corpusPath> [--out <dir>]");
    process.exit(1);
  }
  let outDir = "./.local-knowledge";
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === "--out") outDir = rest[++i];
  }
  const { inventory, evidenceIndex } = runInventory(corpusPath);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "inventory.json"), JSON.stringify(inventory, null, 2));
  writeFileSync(join(outDir, "evidence-index.json"), JSON.stringify(evidenceIndex, null, 2));

  const byStatus = {};
  for (const r of inventory) byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  const summaryLines = [
    "# Inventory summary",
    "",
    `Corpus: \`${corpusPath}\``,
    `Total files: ${inventory.length}`,
    "",
    "## By status",
    ...Object.entries(byStatus).map(([k, v]) => `- ${k}: ${v}`),
    "",
    "## Files needing manual/visual review",
    ...inventory.filter((r) => r.status === "unsupported-format" || r.status === "extraction-failed").map((r) => `- ${r.path} (${r.status})`),
  ];
  writeFileSync(join(outDir, "INVENTORY_SUMMARY.md"), summaryLines.join("\n") + "\n");
  console.log(`Wrote inventory for ${inventory.length} files to ${outDir}`);
  console.log(JSON.stringify(byStatus, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
