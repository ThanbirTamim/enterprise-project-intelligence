# AI Opportunity Matrix — Synthetic Inventory Platform (fictional demonstration)

> Entirely fictional. Demonstrates the output shape of `enterprise-ai-integration-planner`.
> Scores below are illustrative, not measured; a real engagement must populate feasibility inputs
> from real evidence and run `scripts/score-opportunity.mjs` to get a reproducible result.

## OPP-001 — Packing-slip extraction assistance

| Field | Value |
|---|---|
| Target module / workflow | Receiving |
| Current behavior | Associate manually re-keys packing-slip quantities into the Receiving screen [source: receiving-workflow.md#2-steps]. |
| User problem | Manual re-keying causes typos and stock mismatches [source: overview.md#3-known-pain-points-fictional-for-demonstration-only]. |
| Proposed capability | Extract line-item quantities from a scanned/photographed packing slip and pre-fill the Receiving form for associate confirmation. |
| Proposed integration point | New "suggested receipt" step before the existing manual-entry step; associate still confirms/edits before submission. |
| Required data | Scanned packing slip images; existing PO line items for cross-checking. |
| Data availability | Not yet collected in a labeled form (fictional project — would need confirmation in a real engagement). |
| AI technique | Extraction/classification (document extraction with human confirmation). |
| Non-AI alternative | A structured supplier EDI/CSV import, if suppliers can provide one — likely lower risk and should be evaluated first. |
| Expected business value | Reduced data-entry time and fewer stock mismatches — targets to be validated in a pilot, not assumed. |
| Feasibility scores | businessValue 4, dataReadiness 2, integrationFeasibility 4, technicalMaturity 4, securityReadiness 4, evaluationFeasibility 3, maintainability 3, costEfficiency 3 (illustrative). |
| Non-overridable blockers | None identified at this illustrative stage. |
| Weighted score / recommendation | See `scripts/score-opportunity.mjs` output below. |
| Confidence | low (fictional project; no real data reviewed) |
| Source evidence | `receiving-workflow.md#2-steps`, `overview.md#3-known-pain-points-fictional-for-demonstration-only` |

### Reproducible score for OPP-001

```
node skills/enterprise-ai-integration-planner/scripts/score-opportunity.mjs \
  '{"businessValue":4,"dataReadiness":2,"integrationFeasibility":4,"technicalMaturity":4,"securityReadiness":4,"evaluationFeasibility":3,"maintainability":3,"costEfficiency":3,"blockers":[]}'
```

## OPP-002 — Automated reorder alerting (non-AI baseline opportunity)

| Field | Value |
|---|---|
| Target module / workflow | Reporting |
| Current behavior | A staff member reads a weekly CSV report to decide on reorders [source: overview.md#3-known-pain-points-fictional-for-demonstration-only]. |
| User problem | Delay between stock dropping below reorder point and a human noticing it. |
| Proposed capability | Deterministic rule: alert when `current_quantity < reorder_point` (see `sample-catalog.csv`). |
| Non-AI alternative | **This is the recommended solution.** A scheduled job comparing quantity to reorder point is a complete, lower-risk fit — no AI technique is needed here. |
| AI technique | None recommended; included to demonstrate that this skill does not default to AI. |
| Recommendation | Use conventional automation (`non-AI alternative` column), not an AI feature. |
| Source evidence | `overview.md#3-known-pain-points-fictional-for-demonstration-only`, `sample-catalog.csv#table` |

## OPP-003 — Change-history explanation for Purchase Orders

| Field | Value |
|---|---|
| Target module / workflow | Purchase Orders |
| Current behavior | Support staff search old email threads to answer "why was this PO changed" [source: overview.md#3-known-pain-points-fictional-for-demonstration-only]. |
| Proposed capability | A RAG-style assistant over structured PO change logs (once such logs exist) producing cited explanations. |
| Non-AI alternative | First, simply start recording structured change history (who/when/what/why) on every PO edit — this alone may resolve most of the problem without any AI component. |
| AI technique | Retrieval-augmented generation, recommended only after structured change history exists. |
| Non-overridable blockers | `blocker:no-access-control-on-retrieval` — until change-log access control matches PO-level permissions, a retrieval assistant must not be built. |
| Recommendation | `rework-required` — build structured change history and access-controlled retrieval first. |
| Source evidence | `overview.md#3-known-pain-points-fictional-for-demonstration-only` |

### Reproducible score for OPP-003 (showing the blocker rule)

```
node skills/enterprise-ai-integration-planner/scripts/score-opportunity.mjs \
  '{"businessValue":4,"dataReadiness":1,"integrationFeasibility":3,"technicalMaturity":4,"securityReadiness":2,"evaluationFeasibility":3,"maintainability":3,"costEfficiency":3,"blockers":["blocker:no-access-control-on-retrieval"]}'
```
