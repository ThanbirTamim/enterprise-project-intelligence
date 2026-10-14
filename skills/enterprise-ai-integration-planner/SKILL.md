---
name: enterprise-ai-integration-planner
description: >-
  Discover, evaluate, design, prioritize, and plan AI integration opportunities for any existing
  software project, including projects with no current AI capabilities. Use this skill once project
  evidence exists (via project-documentation-discovery and/or software-reverse-engineering) and the
  user wants to know where AI could help, whether it should, and how to adopt it safely. It compares
  every AI proposal against the simplest viable non-AI alternative, scores feasibility
  transparently, treats security/privacy/legal blockers as non-overridable, and never invents ROI,
  accuracy, latency, or cost numbers.
metadata:
  version: 1.0.0
  partOf: enterprise-project-intelligence-agent
  references:
    - references/opportunity-catalog.md
    - references/feasibility-scoring.md
    - references/architecture-alternatives.md
    - references/security-patterns.md
    - references/adoption-roadmap.md
  scripts:
    - scripts/score-opportunity.mjs
---

# enterprise-ai-integration-planner

## Purpose

Given evidence about an existing software project (its workflows, data, architecture, users, and
constraints), identify concrete, defensible places where AI could add value, say clearly where it
should **not** be used, and produce an incremental, governed adoption plan. This skill is the
flagship capability of the toolkit and must work equally well for a project with zero existing AI
features.

## When to use

- After `project-documentation-discovery` (and ideally `software-reverse-engineering`) have produced
  an inventory, evidence index, and/or architecture notes for the target project.
- When a stakeholder asks "where could AI help in this system?" or "should we add AI to X?".
- When evaluating a specific proposed AI feature for feasibility and risk before building it.

## Required inputs

- `evidence-index.json` / `inventory.json` from `project-documentation-discovery` (or equivalent
  evidence gathered manually), covering workflows, data sources, APIs, and constraints.
- Optional architecture notes from `software-reverse-engineering`.
- Any organizational constraints the user supplies (data residency, approved vendors, budget,
  compliance regime). Do not assume constraints that were not stated; ask the user to confirm
  important unstated constraints rather than inventing them, and clearly label anything you must
  assume.

## Execution procedure

### 1. Establish the current-state baseline (§7.1)

Read the available evidence and summarize, with citations to `source_location`:
- Existing business capabilities and user workflows.
- Repetitive manual tasks and information-retrieval pain points called out in the evidence.
- Existing search/automation already in place (do not propose to "add search" if search exists).
- Available APIs/extension points, auth model, data ownership, integration constraints.
- Known technical debt relevant to introducing AI (e.g., no structured logging, no stable API).

Label every baseline statement `documented` (cited to a source), `verified-in-code` (cited to a code
location), or `inferred` (your reasoning, flagged as such). Never state an unverified claim as fact.

### 2. Discover candidate opportunities (§7.2)

Walk the evidence against `references/opportunity-catalog.md`, which groups candidate AI techniques
(LLM-assisted features, RAG, extraction/classification, predictive/analytical models, tool-using
agents, engineering intelligence) alongside the non-AI alternative each should be compared with
(deterministic rules, conventional search, SQL, workflow engines, scheduled jobs). For every
candidate, write down the **non-AI alternative first**, then explain whether AI is actually a better
fit — never assume AI is the default answer.

### 3. Build the opportunity matrix (§7.3)

Use `templates/AI_OPPORTUNITY_MATRIX.template.md` (repo root `templates/`) to record, per opportunity:
ID, feature name, target module/workflow, current behavior, user problem, proposed capability,
integration point, required data, data availability, AI technique, non-AI alternative, expected
business value, feasibility, complexity estimate, dependencies, security/privacy risks, evaluation
method, recommendation, confidence, and source evidence. Populate this only with real project
evidence in the user's private working directory — never commit a populated matrix for a real
project into this public repository; use the blank template plus the synthetic example instead.

### 4. Score feasibility transparently (§7.4)

Run `scripts/score-opportunity.mjs` (or apply `references/feasibility-scoring.md` by hand) against
each candidate across: business value, data readiness, integration feasibility, technical maturity,
security readiness, evaluation feasibility, maintainability, cost efficiency. The script enforces the
rule in `references/feasibility-scoring.md` §"Non-overridable blockers": if any critical
security/privacy/legal/authorization blocker is flagged, the opportunity's recommendation is forced
to `blocked` or `rework-required` regardless of the weighted score. Never report a numeric score as
if it alone determines the recommendation.

### 5. Design architecture alternatives (§7.5)

For shortlisted opportunities, compare the options in `references/architecture-alternatives.md`
(direct API integration, internal AI service, provider abstraction layer, RAG with an appropriately
scoped retrieval store, async processing, local models, or staying with conventional automation)
against security, data residency, privacy, approval burden, effort, latency, cost, availability,
portability, observability, maintenance, and vendor lock-in. Do not default to microservices, vector
databases, orchestration frameworks, or event buses unless the opportunity's actual requirements
justify them — state the justification explicitly when you do.

### 6. Design secure integration patterns (§7.6)

For each shortlisted feature, use `references/security-patterns.md` to specify entry point, involved
components, data flow, authN/authZ, access-controlled retrieval, input validation, prompt-injection
defenses, output validation, timeouts/retries, rate limiting, audit logging, monitoring, cost
controls, fallback behavior, feature flags, rollback, and required human approval points. Treat all
retrieved documents and user-supplied content as untrusted input. The AI component must never bypass
the host application's existing permission checks or execute sensitive actions without an approval
step appropriate to the risk.

### 7. Produce an incremental adoption roadmap (§7.7)

Use `references/adoption-roadmap.md`'s five phases (discovery/governance, low-risk PoC, controlled
pilot, production readiness, measured expansion). Each phase needs objectives, deliverables,
dependencies, acceptance criteria, risks, and exit conditions. Select the first pilot using the
feasibility scoring output, not popularity or novelty.

### 8. Define measurable success criteria (§7.8)

For each pilot, define evaluation metrics (task completion rate, time saved vs. a stated baseline,
output correctness, groundedness, citation validity, human correction rate, unauthorized data
exposure incidents, latency, cost per successful task, availability, adoption, support burden) and
**how each will be measured**. Do not state a target number (e.g., "95% accuracy") unless the user
supplied it or it is explicitly labeled `proposed target — to be validated`, never `expected result`.

### 9. Generate artifacts (§7.9)

On request, generate any of: `AI_INTEGRATION_STRATEGY.md`, `AI_OPPORTUNITY_MATRIX.md`,
`AI_FEASIBILITY_ASSESSMENT.md`, `AI_REFERENCE_ARCHITECTURE.md`, `AI_SECURITY_AND_GOVERNANCE.md`,
`AI_EVALUATION_FRAMEWORK.md`, `AI_IMPLEMENTATION_ROADMAP.md`, `AI_PILOT_PROPOSAL.md`,
`AI_INTEGRATION_FAQ.md`, a prioritization spreadsheet (CSV), a risk register (use
`templates/risk-register.template.md`), and a pilot acceptance checklist. Use the templates in the
repo root `templates/` directory as the structural starting point and fill them with the user's real
project evidence in their private working directory, not in this public repository.

## Evidence requirements

- Every "current behavior" and "user problem" statement must cite a `source_location` from the
  evidence index, or be explicitly labeled `unverified / stakeholder-reported`.
- Every feasibility score must show its component sub-scores, not just the total.
- Every architecture recommendation must name the specific requirement that drove it.

## Anti-fabrication rules

- Never present AI as the default solution; always name and fairly evaluate the simplest viable
  non-AI alternative first.
- Never invent ROI, accuracy, latency, cost, or adoption numbers. Label any target as a
  to-be-validated proposal, not a guaranteed outcome.
- Never let a high weighted feasibility score override a critical security, privacy, legal, or
  authorization blocker; `scripts/score-opportunity.mjs` encodes this as a hard rule, not a heuristic.
- Never recommend giving an AI component authority to bypass existing application permission checks.
- Never publish a populated, project-specific opportunity matrix, risk register, or pilot proposal
  into this public repository; keep those in the user's private working directory.

## Error handling

- If evidence is insufficient to assess an opportunity, mark it `insufficient-evidence` rather than
  guessing a score, and list exactly what evidence is missing.
- If the target project already has an AI feature in this area, say so and scope the opportunity as
  an improvement/extension, not a new introduction.

## Validation criteria

- Every opportunity in the matrix has a non-AI alternative recorded.
- Every recommendation of `go` has no unresolved critical blocker.
- The scoring script's blocker rule is covered by an automated test (see `tests/`).
- Generated artifacts validate as well-formed Markdown/CSV.

## References

- `references/opportunity-catalog.md`
- `references/feasibility-scoring.md`
- `references/architecture-alternatives.md`
- `references/security-patterns.md`
- `references/adoption-roadmap.md`
- `templates/AI_OPPORTUNITY_MATRIX.template.md`, `templates/AI_PILOT_PROPOSAL.template.md`,
  `templates/risk-register.template.md` (repo root `templates/`)
- Synthetic worked example: `examples/synthetic-inventory-system/ai-opportunity-matrix/`
