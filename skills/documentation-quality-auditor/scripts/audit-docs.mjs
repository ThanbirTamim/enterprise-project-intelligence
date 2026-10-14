#!/usr/bin/env node
/**
 * Reference documentation audit: broken internal references + unsupported strong claims,
 * operating on the inventory/evidence-index produced by project-documentation-discovery.
 * Pure function over structured input; no network calls.
 */
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { join } from "node:path";

const STRONG_CLAIM_RE = /\b(always|never|guaranteed|100%|zero downtime|fully compliant)\b/i;

export function auditDocs({ corpusPath, inventory, evidenceIndex, fileTexts }) {
  const findings = [];

  // Broken internal references: look for markdown-style links in fileTexts and verify they resolve.
  for (const [relPath, text] of Object.entries(fileTexts || {})) {
    const linkRe = /\]\(([^)]+)\)/g;
    let m;
    while ((m = linkRe.exec(text))) {
      const target = m[1];
      if (/^https?:\/\//.test(target)) {
        if (/\b(10\.\d+\.\d+\.\d+|192\.168\.|localhost|\.internal\b|\.corp\b)\b/.test(target)) {
          findings.push({ category: "internal-looking-external-link", severity: "medium", source_path: relPath, detail: "Link matches internal-hostname heuristic (value redacted).", redacted: true });
        }
        continue;
      }
      const resolved = join(corpusPath, relPath, "..", target);
      if (!existsSync(resolved) && !existsSync(join(corpusPath, target))) {
        findings.push({ category: "broken-internal-reference", severity: "high", source_path: relPath, detail: `Reference "${target}" does not resolve within the corpus.` });
      }
    }

    for (const line of text.split("\n")) {
      if (STRONG_CLAIM_RE.test(line) && !/\[source:/i.test(line) && !/#/.test(line)) {
        findings.push({ category: "unsupported-claim", severity: "medium", source_path: relPath, detail: `Strong claim without citation: "${line.trim().slice(0, 120)}"` });
      }
    }
  }

  return { findings, totalFiles: Object.keys(fileTexts || {}).length };
}

async function main() {
  console.error("This script is intended to be imported programmatically with pre-loaded file texts.");
  console.error("See skills/documentation-quality-auditor/SKILL.md for the full procedure.");
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
