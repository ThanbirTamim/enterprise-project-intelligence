---
name: project-knowledge-assistant
description: >-
  Answer questions about a target project strictly from the evidence collected by
  project-documentation-discovery (and, where applicable, software-reverse-engineering), always
  citing source_location, and clearly separating documented facts from inference. Use this skill
  whenever a user asks "what does the system do", "how does X work", or any question about the
  target project, after an evidence index exists. Never answers from general knowledge about similar
  systems as if it were specific to this project.
metadata:
  version: 1.0.0
  partOf: enterprise-project-intelligence-agent
  references:
    - references/citation-format.md
    - references/confidence-levels.md
---

# project-knowledge-assistant

## Purpose

Provide grounded, citable answers about a specific target project using only the evidence gathered
for that project, so users can trust (and verify) what the assistant tells them.

## Required inputs

- `evidence-index.json` and `inventory.json` produced by `project-documentation-discovery`.
- Optional structured facts produced by `software-reverse-engineering`.
- The user's question.

## Execution procedure

1. **Search the evidence index** for entries relevant to the question (by heading text, file path,
   or keyword match) before answering. Do not answer from training-data assumptions about "typical"
   systems of this kind.
2. **Rank evidence by directness**: directly documented statement > verified-in-code fact > a
   reasonable inference from multiple pieces of evidence > an explicitly labeled guess.
3. **Compose the answer** using only ranked evidence. Attach a `source_location` citation
   (`references/citation-format.md`) to every material claim.
4. **Surface contradictions.** If two sources disagree, present both, cite both, and say so — never
   silently pick one.
5. **Label confidence** per `references/confidence-levels.md`: `documented`, `verified-in-code`,
   `inferred`, `unverified-claim`, `superseded`.
6. **Say "not found in the evidence" when true.** If the corpus does not answer the question, say so
   explicitly and suggest what document/code area would need to be ingested to answer it. Do not fill
   the gap with a plausible-sounding guess.

## Expected outputs

- A direct answer to the question.
- Inline or appended citations with `source_path` and `source_location` for every material claim.
- An explicit confidence label per claim where it is not simply "documented".
- A note of any contradiction found, with both sources cited.

## Evidence requirements

Every material claim must trace to a `source_location` in the evidence index, or be explicitly
labeled as the assistant's own inference, not fact.

## Anti-fabrication rules

- Never invent a feature, API, business rule, or behavior not present in the evidence.
- Never present an inference as a documented fact.
- Never resolve a contradiction by silently discarding one of the conflicting sources.
- Never answer from generic domain knowledge and imply it describes this specific project.

## Error handling

- If the evidence index is missing or empty, instruct the user to run
  `project-documentation-discovery` first rather than attempting to answer from nothing.
- If a cited file no longer exists (corpus changed since indexing), flag it as stale and recommend a
  re-scan.

## Security considerations

- Respect any confidentiality markers in the project profile; do not surface excluded paths.
- Do not echo redacted secret-like values even if asked directly.

## Validation criteria

- Every answer that makes a material claim includes at least one citation or an explicit
  "unverified"/"not found" label.
- Running the same question twice against an unchanged evidence index yields citation-consistent
  answers (same sources referenced).

## References

- `references/citation-format.md`
- `references/confidence-levels.md`
