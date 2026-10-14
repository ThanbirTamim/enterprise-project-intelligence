---
name: project-documentation-discovery
description: >-
  Inventory and ingest an arbitrary project's documentation corpus (Markdown, HTML, plain text,
  DOCX, PPTX, PDF, CSV, JSON, YAML, images/screenshots, source code and config files, plus
  Keynote/Pages via their exported formats). Use this skill first, whenever a new project corpus is
  supplied, whenever the corpus changes, or whenever another skill needs a source-evidence index. It
  builds a document inventory and a source evidence index without loading the whole corpus into the
  model's context, and it never claims a format is supported unless extraction was actually verified
  for that file.
metadata:
  version: 1.0.0
  partOf: enterprise-project-intelligence-agent
  references:
    - references/format-matrix.md
    - references/extraction-checklist.md
  scripts:
    - scripts/inventory.mjs
---

# project-documentation-discovery

## Purpose

Turn an arbitrary, unfamiliar folder of project documents into a structured, traceable **document
inventory** and **source evidence index** that every other skill in this toolkit can rely on.
This skill does not interpret or summarize the project — it catalogs what exists, what could be
extracted, what could not, and exactly where every extracted fact came from.

## Scope

- In scope: discovering files, classifying format, extracting text/structure where tooling supports
  it, recording headings/sections/pages/slides, flagging extraction gaps, building a stable per-file
  ID and a corpus-wide index.
- Out of scope: architectural interpretation (`software-reverse-engineering`), answering questions
  (`project-knowledge-assistant`), and AI opportunity analysis (`enterprise-ai-integration-planner`).
  Those skills consume this skill's output; they do not re-walk the filesystem themselves.

## Required inputs

- `corpusPath` — path to the folder containing the target project's documentation and/or source code.
  Treat it as read-only. Never modify, move, or delete files inside it.
- Optional `project-profile.yaml` (see `templates/project-profile.example.yaml` in the repo root) that
  names the project, states confidentiality level, and lists any paths to exclude.
- Optional previous inventory (`inventory.json`) for incremental re-scans.

## Execution procedure

1. **Enumerate files.** Walk `corpusPath` recursively. Skip VCS metadata (`.git`), build output,
   `node_modules`, and anything the project profile explicitly excludes. Record relative path, size,
   modification time, and a content hash (for change detection on re-scans).
2. **Classify format** by extension and, where ambiguous, by content sniffing (e.g., a `.txt` file
   that is actually CSV). Use `references/format-matrix.md` as the authoritative support matrix.
3. **Extract per supported format**, preserving:
   - relative path, file type, detected title;
   - heading/section hierarchy (Markdown headings, HTML `h1`-`h6`, DOCX styles);
   - page or slide number where the format exposes one (PDF pages, PPTX slides);
   - tables and structured data, kept as structured rows rather than flattened prose;
   - links/references to other files or external assets;
   - source modification metadata when available.
4. **Mark extraction status per file** as one of: `extracted-full`, `extracted-partial`,
   `unsupported-format`, `extraction-failed`, or `not-yet-processed`. Never upgrade a file's status
   past what the extractor actually achieved. If a PPTX/Keynote-exported deck contains diagrams,
   SmartArt, or layout-dependent meaning that text extraction cannot capture, mark it
   `extracted-partial` and add a warning naming what was likely missed (e.g., "diagram relationships
   not captured; visual inspection recommended").
5. **Process incrementally.** Do not load the full corpus into a single context window. Process file
   by file (or batch by batch), write each file's extraction record to the inventory as you go, and
   summarize only aggregate counts back to the user/caller.
6. **Build the source evidence index.** For every extracted unit (a heading section, a table, a
   paragraph used later as evidence), assign a stable `source_location` (e.g.,
   `path#heading-slug`, `path#page-12`, `path#slide-7`, `path#row-42`) so downstream skills can cite
   it exactly. See `docs/EVIDENCE_AND_PROVENANCE.md` in the repo root for the shared schema.
7. **Write outputs** (see below) to a working directory that is explicitly outside the public package
   (e.g., `./.local-knowledge/<project-id>/`), never into the skill's own `skills/` tree.
8. **Report a summary**: file counts by status, formats seen, formats requested but unsupported,
   and the list of files that need visual/manual inspection.

## Expected outputs

- `inventory.json` — one record per file: `{ path, type, title, status, hash, warnings[] }`.
- `evidence-index.json` — one record per extracted unit with `source_path`, `source_location`,
  `heading_path`, `evidence_type` (`text`, `table`, `image-caption`, `code`), and `extracted_at`.
- `INVENTORY_SUMMARY.md` — human-readable summary with per-format counts and open warnings.
- A list of files flagged for manual/visual review (diagrams, screenshots, complex decks).

## Evidence requirements

- Every entry in `evidence-index.json` must resolve to a real file and location inside `corpusPath`.
- Do not fabricate a heading, page, or slide number. If a location cannot be determined, store
  `source_location: "unknown"` and add a warning rather than guessing.

## Error handling

- Missing/unreadable files: record `extraction-failed` with the OS error message, continue the scan.
- Password-protected or corrupt documents: record `extraction-failed`, do not attempt to bypass
  protection.
- Formats without a verified extractor in this toolkit (see `references/format-matrix.md`): record
  `unsupported-format` and recommend a manual export/conversion step (e.g., exporting Keynote to
  PDF/PPTX, or Pages to DOCX, before re-running discovery).

## Security considerations

- Treat the corpus as potentially confidential. Never copy corpus content into this toolkit's public
  `skills/`, `templates/`, or `examples/` directories.
- Do not transmit file contents to a network service unless the user has explicitly configured and
  consented to a model/document-processing provider for that purpose; document any such provider in
  the resulting summary.
- Redact obvious secrets (API keys, tokens, passwords) encountered in configuration files from the
  evidence index; store only `"redacted-secret-like-value"` plus the file/line reference.

## Anti-fabrication rules

- Never invent a file, heading, page/slide number, or table that is not actually present in the
  corpus.
- Never mark a format `extracted-full` unless the extraction logic that ran actually supports that
  format; prefer under-claiming (`extracted-partial`/`unsupported-format`) over over-claiming.
- Never silently drop extraction warnings to make a summary look cleaner.

## Validation criteria

- Every file in `corpusPath` appears exactly once in `inventory.json`.
- Every `evidence-index.json` entry has a resolvable `source_path`.
- No file content from `corpusPath` is written into this repository's public directories.
- Re-running on an unchanged corpus reproduces the same `inventory.json` (same hashes/statuses).

## References

- `references/format-matrix.md` — per-format support status and extraction method.
- `references/extraction-checklist.md` — step-by-step checklist used during extraction.
- `scripts/inventory.mjs` — reference implementation: walks a folder and emits `inventory.json`
  for the formats this toolkit can parse with built-in Node.js tooling (Markdown, text, JSON, YAML,
  CSV, HTML headings). Formats requiring external libraries (DOCX/PPTX/PDF binary parsing) are
  reported as `unsupported-format` by this reference script and should be filled in by a project that
  adds the relevant optional dependency — do not claim they work without doing so.

## Example (synthetic)

See `examples/synthetic-inventory-system/source-docs/` for a small synthetic documentation set and
`examples/synthetic-inventory-system/generated-docs/INVENTORY_SUMMARY.md` for the resulting inventory
summary, generated entirely from fictional content.
