---
name: engineering-knowledge-transfer
description: >-
  Generate onboarding guides, operational runbooks, handover documents, troubleshooting guides, and
  role-specific learning paths from project evidence. Use this skill when a user needs to bring a new
  engineer, operator, or reviewer up to speed on a target project, or when preparing a handover
  between teams.
metadata:
  version: 1.0.0
  partOf: enterprise-project-intelligence-agent
  references:
    - references/learning-path-patterns.md
---

# engineering-knowledge-transfer

## Purpose

Convert gathered project evidence into practical, role-specific learning and operational material,
so a new team member or an incoming operator can get productive quickly with traceable sources
rather than secondhand oral tradition.

## Required inputs

- Evidence index and/or reverse-engineering output for the target project.
- The target audience/role (e.g., new backend engineer, on-call operator, incoming reviewer).
- Scope (whole system vs. a specific module/workflow).

## Execution procedure

1. **Pick the artifact type** based on the request: onboarding guide, runbook, handover document,
   troubleshooting guide, or learning path. Use `references/learning-path-patterns.md` for the
   structure matching the role.
2. **Sequence content from fundamentals to specifics**: system purpose → architecture overview →
   core workflows → where things usually go wrong → how to get help/escalate.
3. **Cite every factual claim** to its evidence source so the new team member can go deeper when
   needed.
4. **Call out open questions / unknowns explicitly** (e.g., areas the evidence does not cover) rather
   than implying full coverage, since gaps are exactly what a new team member needs flagged.
5. **Include a "known limitations of this material" section** stating what the generated guide does
   NOT cover and why (e.g., parts of the system without available documentation or code access).

## Expected outputs

- The requested artifact (onboarding guide / runbook / handover doc / troubleshooting guide /
  learning path), structured per `references/learning-path-patterns.md`, cited throughout.
- An explicit "known limitations" section.

## Evidence requirements

Every factual/behavioral claim cites a `source_location`.

## Anti-fabrication rules

- Never invent an operational procedure (e.g., a deployment or rollback step) not evidenced by
  documentation or code; if the procedure isn't documented, say so and recommend confirming with a
  current owner rather than guessing a plausible-sounding runbook step.
- Never present a partial-coverage guide as complete.

## Error handling

- If asked for a runbook with no operational evidence available, generate a skeleton with explicit
  `TODO: confirm with current operator` markers rather than fabricated steps.

## Validation criteria

- Every procedural claim has a citation or an explicit `TODO: confirm` marker.
- The "known limitations" section is present and non-generic (names actual gaps found during this
  run).

## References

- `references/learning-path-patterns.md`
