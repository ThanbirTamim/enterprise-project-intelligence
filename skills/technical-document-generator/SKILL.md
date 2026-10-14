---
name: technical-document-generator
description: >-
  Produce consistent technical documentation (Markdown and HTML reliably; DOCX/PPTX only through a
  verified workflow) from project evidence and/or other skills' outputs, following a consistent
  document structure and citation style. Use this skill whenever a user needs a written artifact
  (architecture doc, AI planning doc, onboarding guide, risk register) assembled from evidence
  already gathered by other skills, rather than generating prose from scratch without grounding.
metadata:
  version: 1.0.0
  partOf: enterprise-project-intelligence-agent
  references:
    - references/document-structure.md
  scripts:
    - scripts/render-markdown-to-html.mjs
---

# technical-document-generator

## Purpose

Turn structured findings (from discovery, reverse engineering, AI planning, or other skills) into a
well-formed, citation-preserving document in the format the user actually needs, without silently
dropping evidence links in the process.

## Required inputs

- Structured findings/evidence from an upstream skill (e.g., opportunity matrix rows, architecture
  reconstruction, inventory summary).
- Target document type and format (Markdown, HTML; DOCX/PPTX only via a verified exporter — see
  `docs/SUPPORTED_FORMATS.md`).

## Execution procedure

1. **Select the structure** from `references/document-structure.md` matching the document type
   (strategy doc, assessment, roadmap, onboarding guide, etc.), or use the matching template in the
   repo-root `templates/` directory if one exists for this document type.
2. **Populate sections from evidence**, preserving every citation attached to the source finding.
   Do not paraphrase away a citation.
3. **Render to the target format.** For Markdown → HTML, use `scripts/render-markdown-to-html.mjs`
   (built-in, verified). For DOCX/PPTX, only claim support if the consuming project has wired in a
   verified exporter; otherwise, hand back a Markdown document plus an explicit note that DOCX/PPTX
   export requires an additional, verified conversion step.
4. **Validate the result**: well-formed Markdown (no unmatched code fences, consistent heading
   levels), valid HTML (no unmatched tags) if HTML was produced.

## Expected outputs

- The requested document in the requested, actually-supported format.
- A list of any sections that could not be populated due to missing evidence (left as
  "`TODO: evidence needed`" rather than invented content).

## Evidence requirements

Every factual section must retain the citations attached to its source finding; the generator must
not introduce new, uncited factual claims.

## Anti-fabrication rules

- Never invent content to fill a section with no evidence; mark it as a gap instead.
- Never claim DOCX/PPTX export succeeded without having actually run a verified exporter.

## Error handling

- If requested format has no verified exporter, generate the Markdown version and clearly state the
  limitation rather than silently emitting a differently-formatted but unverifiable file.

## Validation criteria

- Generated Markdown passes a basic structural lint (heading hierarchy, closed code fences).
- Generated HTML has matching open/close tags for the elements the renderer emits.
- No citation present in the source finding is missing from the rendered document.

## References

- `references/document-structure.md`
- `scripts/render-markdown-to-html.mjs`
