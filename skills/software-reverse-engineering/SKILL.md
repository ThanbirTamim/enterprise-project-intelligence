---
name: software-reverse-engineering
description: >-
  Reconstruct a target system's architecture, modules, APIs, data model, workflows, and external
  dependencies from available evidence (documentation and/or source code), clearly separating facts
  verified in code from facts only documented and from inferences. Use this skill after
  project-documentation-discovery when the user needs an architecture picture, a module map, a data
  model, or a workflow reconstruction, especially when documentation is incomplete, outdated, or the
  codebase is only partially available.
metadata:
  version: 1.0.0
  partOf: enterprise-project-intelligence-agent
  references:
    - references/reconstruction-method.md
    - references/architecture-diagram-notation.md
---

# software-reverse-engineering

## Purpose

Build an evidence-grounded picture of how a system is actually built and how it actually behaves,
reconciling documentation against source code where both are available, and being explicit about
what cannot be determined from the materials provided.

## Required inputs

- `evidence-index.json`/`inventory.json` from `project-documentation-discovery`.
- Source code, if available (full or partial). Partial code is expected and acceptable — scope
  conclusions to what was actually inspected.
- Any existing architecture diagrams supplied by the user (treated as a claim to verify, not ground
  truth, if code is available to check against).

## Execution procedure

1. **Inventory modules/subsystems** from directory structure, package manifests, and documented
   module boundaries. Cite both the code location and any documentation describing it.
2. **Reconstruct APIs and routes** from route definitions, OpenAPI/Swagger files, or documented
   endpoints. Mark `verified-in-code` vs `documented-only`.
3. **Reconstruct the data model** from schema files, migrations, ORM models, or documented entity
   lists. Note foreign-key/relationship evidence explicitly; do not infer a relationship that is not
   actually present in schema or code.
4. **Reconstruct workflows** by tracing how a user action moves through UI → API → service → data
   layer, where the code is available; otherwise reconstruct from documented step sequences and flag
   the reconstruction as `documented-only, not code-verified`.
5. **Identify external dependencies** (third-party services, libraries with material behavioral
   impact, infrastructure dependencies) from manifests/config and documentation.
6. **Reconcile conflicts.** When documentation and code disagree, record both, mark the code as
   generally more authoritative for *current* behavior, and flag the documentation as outdated —
   but do not discard the documentation; it may describe intended/future behavior.
7. **Record architectural decisions and security boundaries** found in ADRs, comments, or
   documentation; do not infer a security boundary that is not actually enforced in code if code is
   available to check.
8. **State explicit limitations** — list what could not be verified due to missing/partial code,
   obfuscation, or unavailable services, rather than presenting a best-guess architecture as complete.

## Expected outputs

- Module/subsystem map with evidence citations.
- API/route inventory with verification status.
- Data model summary with relationship evidence.
- Workflow reconstructions with step-level citations.
- A list of documentation-vs-code discrepancies.
- An explicit "unknown / not verifiable from provided materials" section.

## Evidence requirements

Every architectural claim must be tagged `verified-in-code`, `documented-only`, or `inferred`, with
a citation for the first two and a stated rationale for the third.

## Anti-fabrication rules

- Never draw a component, API, or relationship that is not evidenced by code or documentation.
- Never present an inferred architecture diagram as verified without labeling it as inferred.
- Never silently resolve a documentation/code conflict by discarding one side.

## Error handling

- If no source code is provided, say so explicitly in every output and scope all architecture
  statements to `documented-only`.
- If code is present but a module cannot be statically understood (e.g., heavy use of
  reflection/dynamic dispatch, generated code, or a language without tooling support in this review),
  flag it as `architecture-uncertain` rather than guessing its behavior.

## Security considerations

- Do not reproduce literal secrets, internal hostnames, or credentials found in code/config in any
  generated output; redact and cite only the file/line.

## Validation criteria

- Every diagram node/edge traces to at least one citation or is explicitly labeled inferred.
- The discrepancy list is non-empty whenever documentation and code evidence actually disagree (i.e.,
  disagreements are not silently smoothed over).

## References

- `references/reconstruction-method.md`
- `references/architecture-diagram-notation.md`
