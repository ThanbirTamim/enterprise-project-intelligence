#!/usr/bin/env node
/**
 * CLI entry point for the toolkit's reusable scripts.
 *
 * Usage:
 *   node scripts/cli.mjs list
 *   node scripts/cli.mjs validate
 *   node scripts/cli.mjs inventory <corpusPath> [--out <dir>]
 *   node scripts/cli.mjs release-audit [--pack]
 */
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateSkills, listSkillDirs, parseFrontmatter } from "./lib/skills.mjs";
import { readFileSync } from "node:fs";
import { runInventory } from "../skills/project-documentation-discovery/scripts/inventory.mjs";
import { runReleaseAudit } from "./release-audit.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function cmdList() {
  const dirs = listSkillDirs(ROOT);
  console.log(`Available skills (${dirs.length}):\n`);
  for (const dir of dirs) {
    const content = readFileSync(join(dir, "SKILL.md"), "utf8");
    const { data } = parseFrontmatter(content);
    const name = (data.name || dir.split("/").pop()).padEnd(32);
    const desc = (data.description || "").replace(/\s+/g, " ").trim().slice(0, 90);
    console.log(`  ${name} ${desc}`);
  }
}

function cmdValidate() {
  const issues = validateSkills(ROOT);
  if (issues.length === 0) {
    console.log("All skills valid. No issues found.");
    return 0;
  }
  let errors = 0;
  for (const i of issues) {
    console.log(`[${i.level}] ${i.skill}: ${i.message}`);
    if (i.level === "error") errors++;
  }
  console.log(`\n${issues.length} issue(s), ${errors} error(s).`);
  return errors > 0 ? 1 : 0;
}

function cmdInventory(argv) {
  const [corpusPath, ...rest] = argv;
  if (!corpusPath) {
    console.error("Usage: node scripts/cli.mjs inventory <corpusPath> [--out <dir>]");
    process.exit(1);
  }
  let outDir = "./.local-knowledge";
  for (let i = 0; i < rest.length; i++) if (rest[i] === "--out") outDir = rest[++i];
  const { inventory } = runInventory(corpusPath);
  console.log(`Processed ${inventory.length} files. (Pass --out to persist; this CLI call reports counts only unless invoked via the skill script directly.)`);
}

async function cmdReleaseAudit(argv) {
  const result = await runReleaseAudit(ROOT);
  console.log(JSON.stringify(result.summary, null, 2));
  if (result.findings.length) {
    console.log(`\n${result.findings.length} finding(s):`);
    for (const f of result.findings) console.log(`  [${f.severity}] ${f.category} — ${f.file}`);
  } else {
    console.log("No findings.");
  }
  return result.findings.some((f) => f.severity === "high") ? 1 : 0;
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  let code = 0;
  switch (cmd) {
    case "list": cmdList(); break;
    case "validate": code = cmdValidate(); break;
    case "inventory": cmdInventory(rest); break;
    case "release-audit": code = await cmdReleaseAudit(rest); break;
    default:
      console.log("Usage: node scripts/cli.mjs <list|validate|inventory|release-audit>");
      code = cmd ? 1 : 0;
  }
  process.exit(code);
}

main();
