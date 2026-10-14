# Document ingestion pipeline

## Goal

Turn an arbitrary folder of project documentation (and optionally source code) into a structured
inventory and evidence index, without ever loading the whole corpus into a single model context
window, and without ever claiming a format was extracted when it was only catalogued.

## Pipeline stages

1. **Enumerate** — walk the corpus, skip VCS/build directories and anything the project profile
   excludes, record path/size/mtime/hash.
2. **Classify** — determine format by extension, falling back to content sniffing for ambiguous
   extensions. See `SUPPORTED_FORMATS.md` for the authoritative support matrix.
3. **Extract** — run the format-appropriate extractor. Preserve heading hierarchy, page/slide
   numbers, tables, and links. Redact secret-shaped strings before persisting.
4. **Classify extraction status honestly** — `extracted-full`, `extracted-partial`,
   `unsupported-format`, or `extraction-failed`. Never upgrade a status beyond what actually
   happened.
5. **Index evidence** — assign a stable `source_location` to every extracted unit (see
   `EVIDENCE_AND_PROVENANCE.md`).
6. **Persist incrementally** — write results per file/batch to a private working directory (never
   into this repository's public folders), so very large corpora do not need to fit in context at
   once.
7. **Summarize** — produce `INVENTORY_SUMMARY.md` with counts by status/format and a list of files
   needing manual/visual review.

## Reference implementation

`skills/project-documentation-discovery/scripts/inventory.mjs` implements stages 1-6 for the formats
marked "Verified" in `SUPPORTED_FORMATS.md`, using only Node.js built-ins. It is intentionally
conservative: anything it cannot genuinely parse is reported as `unsupported-format`, not silently
skipped or falsely marked extracted.

## Incremental processing note

For very large corpora, call the inventory function per-subdirectory or per-batch and merge results,
rather than attempting a single pass that must hold the entire corpus's extracted text in memory or
in a single prompt. The reference script's `runInventory()` function accepts a path and can be
invoked repeatedly against subsets of a larger tree.
