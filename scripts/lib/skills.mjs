#!/usr/bin/env node
/**
 * Shared skill-loading/validation library (no external dependencies).
 * Mirrors the structural conventions documented in docs/SKILL_CATALOG.md.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REQUIRED_SECTIONS = ["## Purpose"];
const REQUIRED_SECTION_ALTERNATIVES = [["## Instructions", "## Execution procedure"]];

export function parseFrontmatter(content) {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(content);
  if (!m) return { data: {}, body: content };
  const data = {};
  // Minimal YAML-ish parser sufficient for our frontmatter: flat scalars, one level of nesting,
  // simple lists, and folded/literal block scalars (`>-`, `>`, `|`, `|-`) for top-level keys.
  const lines = m[1].split("\n");
  let currentKey = null;
  let blockScalar = null; // { key, indent, lines: [] }

  const flushBlock = () => {
    if (blockScalar) {
      data[blockScalar.key] = blockScalar.lines.join(" ").replace(/\s+/g, " ").trim();
      blockScalar = null;
    }
  };

  for (const line of lines) {
    if (blockScalar) {
      const indentMatch = /^(\s*)(.*)$/.exec(line);
      const indent = indentMatch[1].length;
      if (line.trim() === "" ) { continue; }
      if (indent > blockScalar.baseIndent || blockScalar.baseIndent === null) {
        if (blockScalar.baseIndent === null) blockScalar.baseIndent = indent;
        blockScalar.lines.push(line.trim());
        continue;
      }
      flushBlock();
    }

    if (/^\s*-\s+/.test(line) && currentKey) {
      data[currentKey] = Array.isArray(data[currentKey]) ? data[currentKey] : [];
      data[currentKey].push(line.replace(/^\s*-\s+/, "").trim());
      continue;
    }

    const topLevelKv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (topLevelKv && !/^\s/.test(line)) {
      currentKey = topLevelKv[1];
      const val = topLevelKv[2].trim();
      if (val === ">-" || val === ">" || val === "|" || val === "|-") {
        blockScalar = { key: currentKey, baseIndent: null, lines: [] };
        continue;
      }
      data[currentKey] = val === "" ? undefined : val.replace(/^"(.*)"$/, "$1");
    }
  }
  flushBlock();
  return { data, body: m[2] };
}

export function listSkillDirs(root) {
  const dir = join(root, "skills");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((n) => join(dir, n))
    .filter((p) => statSync(p).isDirectory())
    .sort();
}

export function validateSkills(root) {
  const issues = [];
  const seen = new Map();
  for (const dir of listSkillDirs(root)) {
    const folder = dir.split("/").pop();
    const skillFile = join(dir, "SKILL.md");
    if (!existsSync(skillFile)) {
      issues.push({ skill: folder, level: "error", message: "missing SKILL.md" });
      continue;
    }
    const content = readFileSync(skillFile, "utf8");
    const { data, body } = parseFrontmatter(content);
    const name = data.name;
    if (!name) {
      issues.push({ skill: folder, level: "error", message: "frontmatter missing 'name'" });
    } else {
      if (!NAME_RE.test(name)) issues.push({ skill: folder, level: "error", message: `name '${name}' is not lowercase-hyphen` });
      if (name !== folder) issues.push({ skill: folder, level: "error", message: `name '${name}' does not match folder '${folder}'` });
      const prev = seen.get(name);
      if (prev) issues.push({ skill: folder, level: "error", message: `duplicate skill name '${name}' (also ${prev})` });
      seen.set(name, folder);
    }
    if (!data.description) {
      issues.push({ skill: folder, level: "error", message: "frontmatter missing 'description'" });
    }
    for (const section of REQUIRED_SECTIONS) {
      if (!body.includes(section)) {
        issues.push({ skill: folder, level: "warning", message: `missing recommended section '${section}'` });
      }
    }
    for (const alts of REQUIRED_SECTION_ALTERNATIVES) {
      if (!alts.some((s) => body.includes(s))) {
        issues.push({ skill: folder, level: "warning", message: `missing one of recommended sections: ${alts.join(" / ")}` });
      }
    }
    // Verify every referenced script/reference file actually exists.
    const refMatches = body.match(/`(references\/[^`]+|scripts\/[^`]+)`/g) || [];
    for (const ref of refMatches) {
      const relPath = ref.slice(1, -1);
      if (!existsSync(join(dir, relPath))) {
        issues.push({ skill: folder, level: "error", message: `referenced file '${relPath}' does not exist` });
      }
    }
  }
  return issues;
}
