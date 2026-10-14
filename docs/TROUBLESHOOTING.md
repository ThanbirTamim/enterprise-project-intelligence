# Troubleshooting

## `node scripts/cli.mjs validate` reports an error

- "frontmatter missing 'name'/'description'" — check the `SKILL.md`'s YAML frontmatter block is a
  valid `---`-delimited block at the very top of the file.
- "name does not match folder" — the frontmatter `name` must equal the containing directory name.
- "referenced file does not exist" — a backticked path like `` `references/foo.md` `` in the SKILL.md
  body was not found relative to the skill directory; check for typos or a missing file.

## Discovery reports many files as `unsupported-format`

Expected for DOCX/PPTX/PDF/Keynote/Pages in the bundled reference implementation — see
`docs/SUPPORTED_FORMATS.md`. Export those files to a supported format (e.g., Keynote → PDF or PPTX)
or add a verified optional parser before re-running.

## Feasibility score seems to ignore a known serious risk

That's intentional if the risk maps to a `blocker:*` value — see
`skills/enterprise-ai-integration-planner/references/feasibility-scoring.md`. Blockers force the
recommendation to `blocked`/`rework-required` regardless of the weighted score. If a real risk isn't
being caught, it's likely not yet mapped to one of the known blocker IDs — add it to the scoring call
explicitly rather than expecting the scores alone to catch it.

## Presentation validator says a rule is "not-checkable-from-this-format"

The deck representation you passed in does not expose that property (e.g., no `palette` object).
This is intentional — the validator refuses to guess a pass/fail for data it cannot see. Supply a
richer deck representation (or check that property manually) if you need it enforced.

## `npm run release-audit` flags something in a file I believe is safe

The scanner is pattern-based and conservative on purpose (e.g., any 40+ character base64-looking
string is flagged). Review the specific line, redact or restructure if it is genuinely sensitive, or
accept the false positive — the script errs toward over-flagging rather than under-flagging.
