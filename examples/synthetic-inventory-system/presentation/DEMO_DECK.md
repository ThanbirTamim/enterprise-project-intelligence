# Enterprise Software: Architecture Assessment and AI Integration Strategy
### (Synthetic demonstration deck — Synthetic Inventory Platform)

> All data, modules, and metrics below are fictional, created solely to demonstrate
> `corporate-presentation-generator` and `presentation-compliance-validator`. No real
> organization's data is used.

---

## Slide 1 — Title
**Enterprise Software: Architecture Assessment and AI Integration Strategy**
Synthetic Inventory Platform · Demonstration Deck · v0.1

Speaker notes: Introduce the fictional "Synthetic Inventory Platform" and the purpose of this deck:
to demonstrate an evidence-backed architecture + AI integration review end to end.

---

## Slide 2 — Executive Summary
- Reviewed five fictional modules: Catalog, Stock Ledger, Purchase Orders, Receiving, Reporting.
- Identified 3 candidate AI opportunities; recommended AI for 1, deterministic automation for 1, and
  "fix data first" for 1 [source: ai-opportunity-matrix/AI_OPPORTUNITY_MATRIX.md].
- No blocking security findings for the recommended pilot; one blocker identified and resolved by
  recommending a prerequisite change instead of proceeding directly to AI.

Speaker notes: This is the one-slide summary; all figures reference the opportunity matrix, not
invented numbers.

---

## Slide 3 — Current-State Architecture
- Modules: Catalog, Stock Ledger, Purchase Orders, Receiving, Reporting
  [source: source-docs/overview.md#2-modules].
- Receiving today is fully manual data entry against an open Purchase Order
  [source: source-docs/receiving-workflow.md#2-steps].

Speaker notes: Diagram omitted in this text-only demo deck; see
`software-reverse-engineering` diagram notation for how a real engagement would render this.

---

## Slide 4 — Example Business Workflow: Receiving
1. Associate scans shipment against open PO.
2. Associate manually enters received quantities.
3. Stock Ledger updates.
4. Discrepancies flagged for supervisor review.
[source: source-docs/receiving-workflow.md#2-steps]

---

## Slide 5 — Engineering Pain Points
- Manual packing-slip re-keying causes stock mismatches.
- Reorder decisions rely on a manually read weekly CSV report.
- PO change history is not consistently recorded, costing support time.
[source: source-docs/overview.md#3-known-pain-points-fictional-for-demonstration-only]

---

## Slide 6 — AI Opportunity Matrix (summary)
| ID | Opportunity | Recommendation |
|---|---|---|
| OPP-001 | Packing-slip extraction assistance | rework-required (data readiness) |
| OPP-002 | Reorder alerting | Use non-AI scheduled rule — no AI needed |
| OPP-003 | PO change-history explanation | rework-required (access-control blocker) |

Full detail: `examples/synthetic-inventory-system/ai-opportunity-matrix/AI_OPPORTUNITY_MATRIX.md`.

---

## Slide 7 — Prioritized AI Use Case: OPP-001
- Weighted feasibility score: 3.45 (reproducible via `score-opportunity.mjs`).
- Non-AI alternative considered: supplier EDI/CSV import — recommended to evaluate first.
- Proposed as the first pilot only after a data-readiness gap (labeled training/eval samples) is
  closed.

---

## Slide 8 — Proposed Reference Architecture (if OPP-001 proceeds)
- Entry point: new "suggested receipt" step before existing manual entry.
- Pattern: asynchronous extraction service, human-in-the-loop confirmation before Stock Ledger write.
- No vector database or agent framework proposed — not justified by this opportunity's scope
  [source: enterprise-ai-integration-planner/references/architecture-alternatives.md].

---

## Slide 9 — Security and Governance
- Associate must confirm/edit extracted quantities before they post (no autonomous stock writes).
- Audit log of original image, extracted value, and confirmed value.
- Rollback: feature flag reverts to fully manual entry instantly.

---

## Slide 10 — Feasibility and Dependencies
- Dependency: a labeled sample of packing slips for evaluation (not yet available in this fictional
  scenario).
- Dependency: supplier EDI feasibility study (may obsolete the AI approach entirely).

---

## Slide 11 — Pilot Design
- Scope: one warehouse, opt-in associates, 4-week window.
- Baseline to measure before pilot: average manual entry time per receipt, current discrepancy rate.

---

## Slide 12 — Evaluation Criteria
- Extraction confirmation-edit rate (lower is better; target to be set after baseline).
- Time-to-complete receipt vs. baseline.
- Zero unauthorized data exposure incidents (hard requirement, not a target to trade off).

---

## Slide 13 — Implementation Roadmap
Discovery/governance → PoC with sample slips → controlled pilot (one warehouse) → production
readiness → measured expansion. See `enterprise-ai-integration-planner/references/adoption-roadmap.md`.

---

## Slide 14 — Risks and Decisions
| Risk | Mitigation |
|---|---|
| Low data readiness | Collect labeled sample before PoC |
| Associate over-trust in suggested values | Require explicit confirmation step, log overrides |

---

## Slide 15 — References and Assumptions
- All content sourced from `examples/synthetic-inventory-system/source-docs/` (fictional).
- Assumption: supplier EDI feasibility not yet evaluated in this fictional scenario.
