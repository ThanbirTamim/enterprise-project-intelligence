# Testing strategy

## Layers tested

1. **Skill structure** — every `SKILL.md` has valid frontmatter (`name` matches folder,
   lowercase-hyphen, unique; `description` present), recommended sections present, and every file
   referenced in backticks (`references/...`, `scripts/...`) actually exists.
   See `tests/skills.test.mjs`.
2. **Deterministic script behavior** — pure-function tests with synthetic fixtures:
   - `tests/inventory.test.mjs` — format classification, extraction status honesty, evidence index
     shape, secret redaction.
   - `tests/feasibility-scoring.test.mjs` — the weighting formula and, critically, that a structural
     blocker forces `recommendation: "blocked"` even when every score is maxed at 5.
   - `tests/presentation-compliance.test.mjs` — required-section/bullet-count/footer/citation
     violations are reported with specific findings, and `not-checkable-from-this-format` is
     reported rather than a false pass when palette metadata is absent.
   - `tests/markdown-render.test.mjs` — headings, lists, tables, and code fences render to
     well-formed, tag-balanced HTML.
   - `tests/release-audit.test.mjs` — a fixture containing a fake AWS-style key and a fake
     `/Users/<name>/...` path is flagged, and the raw matched value is never present in the audit's
     own console/JSON output (only file/line/category).
3. **Synthetic-example integrity** — `tests/synthetic-example.test.mjs` asserts the example corpus
   contains none of a small set of known private-project terms (defense in depth; the authoring
   process is the primary control).

## Running tests

```bash
npm test
```

Uses Node's built-in `node:test` runner — no test framework dependency required.

## What is intentionally not automatically tested

- Semantic quality of model-generated prose (summaries, drafted documentation) — this depends on
  whichever AI agent runs the skill, not on this repository's own code, and is called out in
  `docs/EVALUATION_GUIDE.md` as requiring human/AI-assisted review rather than a unit test.
- Real DOCX/PPTX/PDF parsing — not implemented in the reference scripts; see
  `docs/SUPPORTED_FORMATS.md`. Do not mark a format "Verified" without first adding both the parser
  and a fixture-based test.
