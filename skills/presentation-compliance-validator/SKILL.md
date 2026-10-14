---
name: presentation-compliance-validator
description: >-
  Convert configurable, user-supplied presentation guidelines into structured rules and validate a
  generated slide deck against them, reporting specific violations and corrective actions rather than
  a vague score. Use this skill after corporate-presentation-generator produces a draft, or whenever
  a user wants to check an existing deck against their own corporate guidelines. Never hardcodes a
  specific organization's proprietary rules; always reads rules from a user-supplied or default
  configuration.
metadata:
  version: 1.0.0
  partOf: enterprise-project-intelligence-agent
  references:
    - references/rule-schema.md
  scripts:
    - scripts/validate-deck.mjs
---

# presentation-compliance-validator

## Purpose

Give a deterministic, specific compliance report against configurable presentation rules, clearly
separating what was checked automatically from what needs human judgment.

## Required inputs

- A rule set conforming to `references/rule-schema.md` (user-supplied JSON, or
  `templates/presentation-rules.example.json` at the repo root as a neutral default).
- The slide deck to validate, represented as structured slide data (title, body text, bullet count,
  notes, image references, declared colors/fonts if the authoring format exposes them) — see
  `scripts/validate-deck.mjs` for the expected input shape.

## Execution procedure

1. **Load the rule set.** Split rules into `explicit` (directly from the supplied config),
   `derived` (a reasonable interpretation the tool computed, e.g., "max bullets" derived from a
   stated "content density" guideline), `optional-recommendation`, and `human-review-required`
   (anything semantic/visual that cannot be deterministically checked, e.g., "diagram looks
   professional").
2. **Run deterministic checks** with `scripts/validate-deck.mjs`: required sections present, bullet
   count per slide, title presence, footer/page-number presence, citation markers present on slides
   with numeric claims, font/color values matching the declared palette when the format exposes them.
3. **Flag semantic/visual items** for human review rather than guessing a pass/fail (e.g., actual
   visual balance, logo placement in a rendered image, diagram aesthetic quality).
4. **Report specific violations**: rule ID, slide number, what was found, what was expected, and a
   corrective action — never a bare numeric score with no explanation.
5. **Never let an aggregate "compliance score" hide a specific required-section violation** — always
   list required-section failures individually regardless of the overall score.

## Expected outputs

- A compliance report listing: rule ID, severity, slide reference, finding, corrective action.
- A human-review list for semantic/visual items.
- An overall pass/fail only for rules marked `blocking` in the rule set; non-blocking rules are
  reported as recommendations.

## Evidence requirements

- Every violation references the specific slide and the specific rule ID that was violated.

## Anti-fabrication rules

- Never invent a rule not present in the active rule set or `references/rule-schema.md` defaults.
- Never claim to validate a visual property the input format does not actually expose (e.g., do not
  claim to check "exact logo pixel position" from a Markdown outline that has no image geometry).
- Never present a vague aggregate score as the entire result; always include the itemized list.

## Error handling

- If the rule set is malformed, report the schema violation and stop rather than guessing intent.
- If the deck format exposes less information than a rule needs (e.g., no color metadata), mark that
  rule `not-checkable-from-this-format` rather than silently passing or failing it.

## Security considerations

- Do not bundle or reproduce any real organization's proprietary guideline text; only accept it as a
  user-supplied, external configuration file at runtime.

## Validation criteria

- Running the validator twice on an unchanged deck and rule set yields identical findings.
- Required-section violations are never suppressed by an overall passing score.

## References

- `references/rule-schema.md`
- `scripts/validate-deck.mjs`
- `templates/presentation-rules.example.json` (repo root)
