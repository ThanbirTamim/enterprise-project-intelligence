# Incremental AI adoption roadmap

Five phases. Every phase needs objectives, deliverables, dependencies, acceptance criteria, risks,
and exit conditions before moving to the next phase. Do not skip a phase to accelerate delivery.

## Phase 1 — Discovery and governance
- **Objectives**: confirm the opportunity against real evidence; identify data owners, security and
  privacy reviewers, and budget holders.
- **Deliverables**: baseline summary, opportunity entry, named stakeholders.
- **Acceptance criteria**: stakeholders agree the problem is real and worth evaluating.
- **Exit condition**: a written go/no-go to proceed to a PoC.

## Phase 2 — Low-risk proof of concept
- **Objectives**: test technical feasibility with non-production or synthetic data where possible.
- **Deliverables**: a working prototype, an initial feasibility score, a short write-up of surprises.
- **Acceptance criteria**: the technique demonstrably works on representative data; no blocker found.
- **Exit condition**: a decision to invest in a controlled pilot, or to defer/reject with reasons.

## Phase 3 — Controlled pilot
- **Objectives**: validate the feature with real (but limited/scoped) data and a small user group,
  under the security pattern checklist and with monitoring/rollback in place.
- **Deliverables**: pilot proposal (`AI_PILOT_PROPOSAL.md`), evaluation report against the metrics in
  `AI_EVALUATION_FRAMEWORK.md`, incident log.
- **Acceptance criteria**: evaluation metrics meet the thresholds set in the pilot proposal before the
  pilot started; no unresolved security/privacy incident.
- **Exit condition**: approval for production readiness, or a documented decision to stop.

## Phase 4 — Production readiness
- **Objectives**: close any gaps found in the pilot (observability, cost controls, access control,
  on-call ownership) and complete required organizational approvals.
- **Deliverables**: updated security/governance doc, runbook, on-call ownership assignment.
- **Acceptance criteria**: all required approvals obtained; monitoring and rollback verified in a
  realistic rehearsal.
- **Exit condition**: approval to expand beyond the pilot user group.

## Phase 5 — Measured expansion
- **Objectives**: expand scope/traffic gradually while continuing to measure the same success
  criteria defined in the pilot.
- **Deliverables**: expansion plan with checkpoints, updated cost/latency/accuracy tracking.
- **Acceptance criteria**: metrics remain within agreed bounds at each checkpoint.
- **Exit condition**: either full adoption, a plateau decision, or a rollback if metrics regress.

## Pilot selection rule

Select the first pilot using the feasibility scoring output (`scripts/score-opportunity.mjs`) and the
absence of any non-overridable blocker — not by popularity, executive preference, or novelty alone.
