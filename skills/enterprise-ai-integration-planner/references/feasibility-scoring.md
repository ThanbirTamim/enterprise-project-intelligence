# Transparent feasibility scoring framework

## Scoring dimensions (0-5 each; 0 = not assessed / insufficient evidence)

| Dimension | What it measures |
|---|---|
| `businessValue` | Expected benefit to users/business if the feature works as intended. |
| `dataReadiness` | Availability, quality, volume, and labeling of the data the feature needs. |
| `integrationFeasibility` | How cleanly the feature can be wired into existing architecture/APIs. |
| `technicalMaturity` | Maturity of the required technique/tooling for this use case. |
| `securityReadiness` | Whether access control, data handling, and approvals can be satisfied. |
| `evaluationFeasibility` | Whether success/failure can actually be measured. |
| `maintainability` | Expected ongoing maintenance burden (model drift, prompt upkeep, data pipelines). |
| `costEfficiency` | Expected cost (inference, infra, review labor) relative to expected value. |

## Weighting formula

```
weighted_score = 0.20*businessValue + 0.15*dataReadiness + 0.15*integrationFeasibility
               + 0.10*technicalMaturity + 0.15*securityReadiness + 0.10*evaluationFeasibility
               + 0.075*maintainability + 0.075*costEfficiency
```

Weighted score ranges 0-5. Suggested recommendation bands (advisory only — see blockers below):
- `>= 3.75` → candidate for pilot (`go`)
- `2.5 - 3.74` → needs refinement before piloting (`rework-required`)
- `< 2.5` → not currently feasible (`defer`)

## Non-overridable blockers

Positive criteria must never cancel out a critical blocker. Define blockers separately from scores:

- `blocker:no-authorization-path` — no lawful/approved basis to use the required data this way.
- `blocker:unresolved-pii-exposure` — the design would expose personal data beyond its approved use.
- `blocker:no-access-control-on-retrieval` — a RAG/search feature cannot enforce the same permissions
  as the underlying documents.
- `blocker:irreversible-autonomous-action` — the proposal lets an agent take a sensitive, irreversible
  action without human approval.
- `blocker:regulatory-prohibition` — a named law, regulation, or binding internal policy prohibits it.

**Rule**: if one or more blockers are present, the recommendation is forced to `blocked` (if the
blocker is structural and cannot be mitigated in this design) or `rework-required` (if a concrete
mitigation would remove the blocker), regardless of the weighted score. `scripts/score-opportunity.mjs`
implements this rule and is covered by an automated test; do not reimplement the rule in a way that
lets a numeric score override it.

## Required accompanying documentation per proposal

- Effort range (e.g., "2-4 engineer-weeks for the pilot"), not a single invented point estimate.
- Dependencies (systems, data, approvals) required before work can start.
- Uncertainties the assessor is aware of.
- Required organizational approvals (security review, privacy review, legal, data-owner sign-off).
- Expected measurable outcomes, phrased as hypotheses to validate, not guaranteed results.
- Reasons to defer or reject, stated even when the recommendation is `go` (what would change the
  recommendation).
- A confidence label (`low` / `medium` / `high`) for the assessment itself, separate from the scores.

## Explicitly prohibited

- Do not invent ROI, accuracy, latency, adoption, or cost figures. If the user has not supplied real
  numbers, label any number as `proposed target — not yet measured`.
