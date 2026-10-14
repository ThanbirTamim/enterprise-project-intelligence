# Evidence and provenance model

Every fact this toolkit's skills state about a target project must be traceable to a
`source_location`, or explicitly labeled as inference/unverified.

## Evidence record shape

```json
{
  "source_path": "relative/path/within/corpus.md",
  "source_location": "relative/path/within/corpus.md#heading-slug",
  "heading_path": "Human-readable heading text",
  "evidence_type": "text | table | structured-data | code | image-caption",
  "level": 2,
  "extracted_at": "ISO-8601 timestamp"
}
```

## source_location conventions

| Source type | Convention | Example |
|---|---|---|
| Markdown/HTML heading | `path#heading-slug` | `handbook/lifecycle.md#archiving` |
| PDF page | `path#page-N` | `spec.pdf#page-12` |
| PPTX/Keynote-exported slide | `path#slide-N` | `deck.pptx#slide-7` |
| CSV/table row | `path#row-N` | `data.csv#row-42` |
| Source code | `path#Lstart-Lend` | `src/billing.ts#L120-L135` |

## Confidence labels

See `skills/project-knowledge-assistant/references/confidence-levels.md`:
`documented`, `verified-in-code`, `inferred`, `unverified-claim`, `superseded`.

## Non-negotiable rules

- Never fabricate a `source_location`.
- Never upgrade an inference to `documented`.
- Always preserve both sides of a contradiction rather than silently picking a winner.
- Treat superseded information as historically relevant, not simply deleted — keep the citation and
  mark it superseded.
