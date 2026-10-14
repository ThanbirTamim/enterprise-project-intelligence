# Maintenance

## Routine maintenance

- Re-run `npm test` and `npm run validate` after any skill or script change.
- Keep `docs/SUPPORTED_FORMATS.md` and
  `skills/project-documentation-discovery/references/format-matrix.md` in sync; update both together.
- Re-run `npm run release-audit` before any commit that touches `examples/` or `templates/`.

## Versioning

Semantic versioning (`MAJOR.MINOR.PATCH`):
- `MAJOR` — breaking change to a skill's inputs/outputs or the scoring/validation rules.
- `MINOR` — new skill, new reference, new non-breaking script capability.
- `PATCH` — documentation fixes, bug fixes with no interface change.

Record every change in `CHANGELOG.md`.

## Adding real format support (DOCX/PPTX/PDF)

1. Add the parser as an optional dependency (never a hard dependency).
2. Add a synthetic fixture under `tests/fixtures/`.
2. Add a test proving extraction actually works on that fixture.
4. Update `docs/SUPPORTED_FORMATS.md` and the skill's `references/format-matrix.md` to "Verified".
5. Do not claim support in any `SKILL.md` prose until steps 1-4 are done.

## Deprecating a skill

1. Mark it deprecated in its `SKILL.md` frontmatter metadata and in `docs/SKILL_CATALOG.md`.
2. Keep it for at least one minor version with a deprecation notice before removal.
