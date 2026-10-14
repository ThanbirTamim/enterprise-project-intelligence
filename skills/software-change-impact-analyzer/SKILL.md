---
name: software-change-impact-analyzer
description: >-
  Trace the likely effects of a proposed change across modules, APIs, workflows, tests, data
  entities, and documentation, using evidence from software-reverse-engineering and
  project-documentation-discovery. Use this skill before implementing a non-trivial change, when
  estimating risk/effort, or when a user asks "what would break if we changed X".
metadata:
  version: 1.0.0
  partOf: enterprise-project-intelligence-agent
  references:
    - references/impact-dimensions.md
---

# software-change-impact-analyzer

## Purpose

Give an evidence-grounded answer to "what else is affected if we change X", scoped honestly to what
the available documentation/code actually reveals, rather than a confident-sounding guess.

## Required inputs

- A description of the proposed change (what module/API/data entity/workflow it touches).
- Architecture/data-model evidence from `software-reverse-engineering`.
- Evidence index from `project-documentation-discovery`.

## Execution procedure

1. **Identify the direct target** (the module/API/entity named in the change) and confirm it exists
   in the evidence, citing it.
2. **Trace direct dependents** using `references/impact-dimensions.md`: callers of a changed API,
   consumers of a changed data entity, UI components bound to a changed route, tests exercising the
   changed code, and documentation describing the changed behavior.
3. **Trace indirect/second-order effects** only as far as evidence supports (e.g., a downstream
   service that itself calls the directly affected service); label second-order effects as
   `likely, lower confidence` rather than equally certain to first-order effects.
4. **Classify severity per impacted item**: `breaking` (contract changes), `behavioral`
   (output/behavior changes without a contract break), `cosmetic`, or `unknown-needs-investigation`.
5. **List tests and documentation that must be updated**, not just code.
6. **State what could not be assessed** (e.g., parts of the system outside the available evidence)
   explicitly, rather than implying full coverage.

## Expected outputs

- Impact report: target, direct impacts (with citations and severity), indirect impacts (flagged
  lower-confidence), tests/documentation to update, and an explicit "not assessable from available
  evidence" section.

## Evidence requirements

Every listed impact cites the evidence that connects it to the change (a call site, a schema
reference, a documented workflow step).

## Anti-fabrication rules

- Never claim an impact exists without a traceable connection in the evidence; mark anything else as
  a hypothesis to verify.
- Never present second-order/speculative effects with the same confidence as directly verified ones.

## Error handling

- If reverse-engineering evidence is unavailable for the affected area, state that impact analysis is
  `documentation-only` and scope conclusions accordingly.

## Validation criteria

- Every impact entry has a citation or an explicit confidence label.
- The report explicitly lists what was out of scope / not assessable.

## References

- `references/impact-dimensions.md`
