# Extraction checklist

Run through this checklist for every file processed by `project-documentation-discovery`.

1. [ ] File path recorded relative to `corpusPath` (never an absolute path containing a username
       or private machine path — strip to a relative path before writing any output).
2. [ ] Format classified using `format-matrix.md`.
3. [ ] Title detected (first H1 / document property / filename fallback).
4. [ ] Heading hierarchy captured, each heading given a stable slug.
5. [ ] Tables captured as structured rows, not flattened text.
6. [ ] Page/slide numbers captured where the format exposes them; `null` otherwise (never guessed).
7. [ ] Links to other local files resolved to relative paths; external links kept as-is but flagged
       for a confidentiality check if they look internal (private hostnames, non-public IP ranges).
8. [ ] Extraction status assigned honestly (`extracted-full` / `extracted-partial` /
       `unsupported-format` / `extraction-failed`).
9. [ ] Warnings recorded for anything a text-only pass cannot capture (diagrams, charts, SmartArt,
       embedded objects, speaker notes in unsupported deck formats).
10. [ ] Obvious secret-shaped strings (long random tokens, `-----BEGIN ... KEY-----`, connection
        strings with embedded credentials) redacted before writing to the evidence index.
11. [ ] Record appended to `inventory.json` and, if evidence was extracted, to `evidence-index.json`.
12. [ ] Nothing from the corpus copied into this toolkit's public `skills/`, `templates/`, or
        `examples/` trees.
