---
name: documentation-quality-auditor
description: >-
  Detect contradictions, outdated information, broken references, missing required sections, and
  unsupported claims across a project's documentation corpus. Use this skill after
  project-documentation-discovery to produce a documentation health report, or whenever a user asks
  "is our documentation accurate / up to date / consistent".
metadata:
  version: 1.0.0
  partOf: enterprise-project-intelligence-agent
  references:
    - references/audit-checks.md
  scripts:
    - scripts/audit-docs.mjs
---

# documentation-quality-auditor

## Purpose

Give an evidence-based health report on a documentation corpus: what contradicts what, what looks
stale, what links are broken, what expected sections are missing, and what claims have no supporting
evidence — without fixing or rewriting the documentation itself (defer rewriting to
`technical-document-generator`).

## Required inputs

- `evidence-index.json`/`inventory.json` from `project-documentation-discovery`.
- Optional explicit set of "required sections" per document type the organization expects.
- Optional modification-time threshold for "possibly stale" flags (e.g., >12 months untouched while
  the related code changed more recently).

## Execution procedure

1. **Detect contradictions**: find evidence-index entries addressing the same topic/entity with
   different statements. Report both sources; never auto-resolve by picking one.
2. **Detect staleness**: compare document modification time against related code modification time
   (if code is in scope) or flag documents past the configured age threshold with no recent review
   note.
3. **Detect broken references**: verify that every internal link/path referenced by a document
   actually resolves to a file in the corpus; flag external links that look internal
   (private hostnames) separately as a confidentiality concern, not just a broken link.
4. **Detect missing required sections**: compare each document's heading hierarchy against the
   expected structure for its document type (see `references/audit-checks.md`).
5. **Detect unsupported claims**: flag strong factual assertions (e.g., containing "always",
   "guaranteed", "100%", specific numeric claims) that have no citation to code, data, or another
   source within the corpus.
6. **Produce the report**, grouping findings by severity (`broken-reference` and `contradiction` are
   typically higher severity than `stale` or `missing-section`), each with file, location, and a
   suggested remediation (not an automatic fix).

## Expected outputs

- `DOCUMENTATION_HEALTH_REPORT.md` with findings grouped by category and severity.
- A machine-readable `findings.json` for downstream tooling.

## Evidence requirements

Every finding cites the specific `source_location`(s) involved.

## Anti-fabrication rules

- Never silently resolve a contradiction; always report both sides.
- Never claim a document is stale solely by age if there's recorded evidence it was recently
  reviewed and reaffirmed.
- Never flag a claim as unsupported if a citation does exist elsewhere in the same document — check
  the whole document, not just the sentence, before flagging.

## Error handling

- If the evidence index lacks modification-time metadata for a format, skip staleness checks for
  that file and note the limitation rather than guessing an age.

## Security considerations

- Report confidentiality-relevant findings (internal-looking URLs/paths) without printing the raw
  sensitive value in the audit report; reference the file and line only.

## Validation criteria

- Running the audit twice on an unchanged corpus produces identical findings.
- Every reported broken reference is confirmed by an actual failed resolution attempt, not a guess.

## References

- `references/audit-checks.md`
- `scripts/audit-docs.mjs`
