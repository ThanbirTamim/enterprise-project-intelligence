---
name: corporate-presentation-generator
description: >-
  Generate evidence-backed slide decks (editable source plus PDF preview where tooling permits) for
  a target project, using user-supplied corporate guidelines, templates, and brand assets rather than
  any hardcoded organization's style. Use this skill when the user needs a presentation (e.g.,
  architecture review, AI integration strategy, status update) built from project evidence and their
  own style guide. Always pass the draft through presentation-compliance-validator before calling it
  final.
metadata:
  version: 1.0.0
  partOf: enterprise-project-intelligence-agent
  references:
    - references/default-style-guide.md
    - references/slide-content-patterns.md
---

# corporate-presentation-generator

## Purpose

Produce a presentation that is both evidence-backed (every factual slide traces to project evidence
or is clearly marked illustrative/synthetic) and compliant with whatever corporate presentation
guidelines the user supplies — without hardcoding any single organization's proprietary branding.

## Required inputs

- Presentation purpose/title and target audience.
- Project evidence (from `project-documentation-discovery` / `software-reverse-engineering` /
  `enterprise-ai-integration-planner`) for factual slides, OR an explicit instruction that this is a
  synthetic/demo deck.
- Optional user-supplied guideline rules in the schema used by `presentation-compliance-validator`
  (`templates/presentation-rules.example.json` at the repo root). If none is supplied, use
  `references/default-style-guide.md`, a neutral, originally written style guide with placeholder
  branding — never substitute a real company's proprietary guideline content.
- Output format requirement (Markdown slide outline, PPTX, PDF preview — only claim formats this
  toolkit can actually produce; see `docs/SUPPORTED_FORMATS.md`).

## Execution procedure

1. **Confirm the narrative** with the user: audience, purpose, and the list of sections to cover
   (executive summary, current-state architecture, pain points, opportunities, roadmap, risks, etc.,
   as relevant — adapt the outline to the actual content rather than forcing a fixed slide count).
2. **Draft content slide-by-slide**, citing evidence per `references/slide-content-patterns.md`.
   Every claim of fact must be traceable; mark any illustrative/synthetic content explicitly as such
   in speaker notes so it is never mistaken for a verified finding.
3. **Apply the style guide** (user-supplied or default) for typography, color, layout, titles,
   footers, and required sections, per the active rule set.
4. **Write speaker notes** per slide summarizing the key point and citing sources.
5. **Generate the deck** in the requested, actually-supported format(s).
6. **Run `presentation-compliance-validator`** against the draft and the active rule set before
   presenting it as final; fix reported violations or explicitly flag them for human review if a
   violation requires a design judgment call.
7. **Render and inspect** the output where tooling permits (e.g., convert to PDF and check for
   overflow/truncated text); correct obvious layout defects before delivery.

## Expected outputs

- Editable slide source (Markdown outline at minimum; PPTX/PDF where tooling is available and
  verified — see `docs/SUPPORTED_FORMATS.md`).
- Speaker notes.
- A compliance report from `presentation-compliance-validator`.

## Evidence requirements

- Every factual slide cites a `source_location` or is explicitly labeled "illustrative example /
  synthetic data" in both the slide and the speaker notes.

## Anti-fabrication rules

- Never state a metric, quote, or outcome as real without a citation.
- Never claim a company's proprietary presentation standard is implemented; the default style guide
  is original and neutral, and any organization-specific guideline is supplied by the user, not
  bundled by this toolkit.
- Never embed a real organization's logo/brand assets unless the user explicitly supplies them for
  their own private use outside the public package.

## Security considerations

- Keep any user-supplied private brand assets and guideline files outside the public package;
  reference them by user-provided path, do not copy them into `skills/` or `examples/`.

## Validation criteria

- The deck passes `presentation-compliance-validator`'s deterministic checks, or every remaining
  violation is explicitly listed with a corrective action.
- No slide states a figure/metric without a citation or an "illustrative" label.

## References

- `references/default-style-guide.md` — original, neutral default style guide (placeholder brand).
- `references/slide-content-patterns.md`
- Synthetic demonstration deck: `examples/synthetic-inventory-system/presentation/`
