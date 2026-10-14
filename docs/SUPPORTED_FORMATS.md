# Supported formats

This is the repository-level summary. The authoritative, detailed matrix (kept in lockstep with the
reference extractor) lives at
`skills/project-documentation-discovery/references/format-matrix.md` — read that file for the full
rationale per format.

| Format | Status |
|---|---|
| Markdown | Verified |
| Plain text | Verified |
| JSON | Verified |
| YAML | Verified (subset) |
| CSV | Verified |
| HTML (headings/tables) | Verified (subset — no CSS/JS rendering) |
| Source code / config files | Verified (treated as text) |
| Images / screenshots | Catalogued only (no OCR); flagged for manual review |
| DOCX | Unsupported in the bundled reference implementation (requires an optional dependency) |
| PPTX | Unsupported in the bundled reference implementation (requires an optional dependency) |
| PDF | Unsupported in the bundled reference implementation (requires an optional dependency) |
| Keynote (.key) | Unsupported — export to PPTX/PDF first |
| Pages (.pages) | Unsupported — export to DOCX/PDF first |

**Policy**: a format is only ever reported "extracted" by a skill if an automated test in `tests/`
actually exercises it against a fixture. See `docs/TESTING_STRATEGY.md`.
