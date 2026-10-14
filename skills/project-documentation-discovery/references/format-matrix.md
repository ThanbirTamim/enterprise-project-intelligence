# Supported format matrix

This matrix is the single source of truth for what the reference tooling in this toolkit can
actually extract today versus what requires an optional dependency or manual conversion. Keep it in
sync with `scripts/inventory.mjs` and the repo-level `docs/SUPPORTED_FORMATS.md`. Do not mark a row
"Verified" unless an automated test exercises it.

| Format | Extraction method (reference impl) | Status | Notes |
|---|---|---|---|
| Markdown (`.md`) | Native Node.js text read + heading regex | Verified | Full heading hierarchy. |
| Plain text (`.txt`) | Native Node.js text read | Verified | No structure beyond paragraphs. |
| JSON (`.json`) | `JSON.parse` | Verified | Treated as structured data, not prose. |
| YAML (`.yml`, `.yaml`) | Minimal built-in YAML line scanner | Verified (subset) | Complex anchors/multi-doc YAML should be hand-checked. |
| CSV (`.csv`) | Native split + quote-aware parser | Verified | First row treated as header. |
| HTML (`.html`, `.htm`) | Regex-based heading/table extraction | Verified (subset) | Extracts `h1`-`h6`, `table`; does not render CSS/JS-driven content. |
| Source code / config (`.ts`, `.js`, `.py`, `.java`, `.go`, `.rb`, `.sql`, `.env.example`, etc.) | Treated as text; language-aware parsing is out of scope | Verified (as text) | Used for reverse engineering, not prose extraction. |
| Images / screenshots (`.png`, `.jpg`, `.gif`) | Catalogued by filename/metadata only; no OCR in the reference implementation | Unsupported (cataloguing only) | Flag for manual/visual inspection; do not claim text extraction. |
| DOCX | Not implemented in the bundled reference script | Unsupported (requires optional dependency) | Add a DOCX parser (e.g., an XML-zip reader) behind an explicit opt-in dependency before claiming support. |
| PPTX | Not implemented in the bundled reference script | Unsupported (requires optional dependency) | Same as DOCX; slide numbers and notes require a PPTX-aware parser. |
| PDF | Not implemented in the bundled reference script | Unsupported (requires optional dependency) | Page-level text extraction requires a PDF library; scanned PDFs additionally require OCR. |
| Keynote (`.key`) | No native parser | Unsupported — recommend export to PPTX or PDF first | Apple Keynote's binary/bundle format is not parsed directly; use Keynote's own export, then re-run discovery on the exported file. |
| Pages (`.pages`) | No native parser | Unsupported — recommend export to DOCX or PDF first | Same rationale as Keynote. |

## Policy

- "Verified" means an automated test in `tests/` exercises this format against a synthetic fixture.
- Anything not "Verified" must be reported to the user as `unsupported-format` by the skill, with a
  concrete suggested next step (export/convert, or add an optional dependency).
- If a consuming project adds a real DOCX/PPTX/PDF parser as an optional dependency, update this
  table, add a fixture, add a test, and only then change the status to "Verified".
