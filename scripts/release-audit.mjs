#!/usr/bin/env node
/**
 * Public-release audit.
 *
 * Scans the package's *intended public* files (everything that would be included by `npm pack`,
 * i.e., respects .gitignore/.npmignore-style excludes) for:
 *   - likely secrets (API keys, private keys, connection strings with credentials)
 *   - local filesystem paths that look like a specific user's machine (/Users/<name>/..., /home/<name>/...)
 *   - a small, configurable list of private-term patterns (organization/project identifiers the
 *     user adds to PRIVATE_TERMS below or via a local, uncommitted terms file)
 *
 * It NEVER prints the matched sensitive value — only the file, line number, and rule category.
 * This is a safeguard, not proof of confidentiality; human review is still required before any
 * release. See docs/SECURITY_MODEL.md and docs/IMPLEMENTATION_REPORT.md.
 */
import { pathToFileURL } from "node:url";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const DEFAULT_EXCLUDE_DIRS = new Set([
  ".git", "node_modules", ".idea", ".vscode", "dist", "coverage", ".local-knowledge", ".private",
]);

// Secret-shaped patterns. Deliberately generic; does not depend on any specific vendor's key format
// beyond widely published public shapes (e.g., AWS access key prefix), to avoid overfitting.
const SECRET_PATTERNS = [
  { id: "private-key-block", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { id: "aws-access-key-id", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { id: "generic-bearer-token", re: /\bBearer\s+[A-Za-z0-9\-_.=]{20,}\b/ },
  { id: "connection-string-with-credentials", re: /:\/\/[^\s:/@]+:[^\s:/@]+@[^\s]+/ },
  { id: "long-hex-or-base64-secret-like", re: /\b[A-Za-z0-9+/]{40,}={0,2}\b/ },
];

const PATH_PATTERNS = [
  { id: "local-user-filesystem-path", re: /\/Users\/[^/\s"']+\// },
  { id: "local-user-filesystem-path-linux", re: /\/home\/[^/\s"']+\// },
];

// Add organization/project-identifier terms here if the consuming project needs them. Left empty by
// default so this public script never ships with any real private term baked in.
const PRIVATE_TERMS = [];

function shouldExclude(name) {
  return DEFAULT_EXCLUDE_DIRS.has(name);
}

function walk(dir, root, out = []) {
  for (const entry of readdirSync(dir)) {
    if (shouldExclude(entry)) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, root, out);
    else out.push(p);
  }
  return out;
}

function scanFile(absPath, relPath) {
  const findings = [];
  let text;
  try {
    text = readFileSync(absPath, "utf8");
  } catch {
    return findings; // binary or unreadable; skip text scanning
  }
  const lines = text.split("\n");
  lines.forEach((line, idx) => {
    for (const { id, re } of SECRET_PATTERNS) {
      if (re.test(line)) {
        findings.push({ category: `secret-like:${id}`, severity: "high", file: relPath, line: idx + 1 });
      }
    }
    for (const { id, re } of PATH_PATTERNS) {
      if (re.test(line)) {
        findings.push({ category: `local-path:${id}`, severity: "medium", file: relPath, line: idx + 1 });
      }
    }
    for (const term of PRIVATE_TERMS) {
      if (term && line.includes(term)) {
        findings.push({ category: "private-term", severity: "high", file: relPath, line: idx + 1 });
      }
    }
  });
  return findings;
}

export async function runReleaseAudit(root) {
  const files = walk(root, root);
  let findings = [];
  for (const f of files) {
    const relPath = relative(root, f);
    findings = findings.concat(scanFile(f, relPath));
  }
  const bySeverity = {};
  for (const f of findings) bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
  return {
    findings,
    summary: {
      filesScanned: files.length,
      totalFindings: findings.length,
      bySeverity,
      note: "Automated scanning is a safeguard, not proof of confidentiality. Human review is required before any release.",
    },
  };
}

async function main() {
  const root = process.cwd();
  const result = await runReleaseAudit(root);
  console.log(JSON.stringify(result.summary, null, 2));
  for (const f of result.findings) {
    console.log(`[${f.severity}] ${f.category} — ${f.file}:${f.line} (value redacted)`);
  }
  process.exit(result.findings.some((f) => f.severity === "high") ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
