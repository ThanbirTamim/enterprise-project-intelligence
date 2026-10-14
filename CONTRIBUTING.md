# Contributing

Thanks for your interest in improving this toolkit.

## Ground rules

1. **No confidential content.** Never add a real organization's project name, proprietary feature,
   internal URL, internal file path, employee name, or confidential architecture to any file in this
   repository — including examples, test fixtures, and commit messages. Use the synthetic example
   project pattern instead.
2. **Skills must stay evidence-grounded.** Any new or modified skill must keep (or add) an
   "Anti-fabrication rules" section and must not instruct the agent to invent facts, metrics, or
   outcomes.
3. **Keep scripts dependency-free where practical.** The reference scripts intentionally use only
   Node.js built-ins so the toolkit has no required third-party dependency chain. If you add a
   genuinely necessary dependency (e.g., a real DOCX/PPTX/PDF parser), make it optional, document it
   in `docs/SUPPORTED_FORMATS.md`, and add a test.
4. **Run the checks before submitting:**
   ```bash
   npm run validate
   npm test
   npm run release-audit
   ```
5. **Update `docs/SKILL_CATALOG.md`** when adding, renaming, or removing a skill.

## Adding a new skill

- Create `skills/<kebab-case-name>/SKILL.md` with frontmatter `name` (matching the folder) and
  `description` (what it does and when to use it).
- Include `## Purpose`, `## Instructions` or `## Execution procedure`, and
  `## Anti-fabrication rules` sections.
- Put non-trivial logic in `scripts/` as a plain Node.js module with no required external
  dependency, and reference material in `references/`.
- Add a synthetic example usage if the skill produces a user-facing artifact.

## Reporting issues

Open an issue describing the problem. For security-sensitive reports, see `SECURITY.md`.
