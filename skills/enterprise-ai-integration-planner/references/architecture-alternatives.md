# Architecture alternatives for AI integration

Compare, do not default. For every shortlisted opportunity, state which option was chosen and why,
referencing the specific requirement that drove the decision.

| Option | Best fit when | Key tradeoffs |
|---|---|---|
| Direct model API integration (app calls a hosted model API directly) | Low feature count, low traffic, fast to pilot | Simplest to build; vendor coupling; cost/latency fully exposed to the app; weakest central governance. |
| Internal AI service (thin internal service wraps model calls) | Multiple features need the same model access, or central logging/governance is required | Adds one service to operate; centralizes auth, logging, rate limiting, and cost control. |
| Provider abstraction layer (interface over multiple possible providers) | Vendor lock-in or model portability is a real stated concern | Adds abstraction complexity; only justified when portability is an actual requirement, not a hypothetical one. |
| RAG with a right-sized retrieval store | Users need natural-language answers grounded in an existing authorized document set | Retrieval store must inherit the source documents' access control; do not introduce a vector database unless keyword/full-text search has been shown insufficient for the real corpus size and query patterns. |
| Asynchronous AI processing (queued/batched, not inline with the request) | Latency-tolerant tasks (e.g., nightly classification, batch extraction) | Decouples cost/latency from user-facing requests; adds operational complexity (queue, retry, backlog monitoring). |
| Locally hosted / on-prem models | Data residency, confidentiality, or offline requirements rule out a hosted API | Higher infra and ops burden; model capability may lag hosted frontier models; justified by a real residency/compliance requirement, not convenience. |
| Conventional deterministic automation (no model at all) | The task is fully specifiable with rules/queries | Lowest risk and cost; always the baseline comparison; choose this when it satisfies the user problem as well as or better than an AI approach. |

## Evaluation axes (score each alternative against the ones actually in contention)

Security · data residency · privacy · organizational approval burden · implementation effort ·
latency · cost · availability · model portability · observability · maintenance burden · vendor
dependence.

## Explicit anti-overengineering rule

Do not propose microservices, vector databases, agent-orchestration frameworks, or event buses by
default. Each must be justified by a specific requirement recorded in the opportunity's entry (e.g.,
"vector DB justified: corpus exceeds 500k chunks and keyword search precision measured at <40% in a
spot check"). If no such requirement is recorded, prefer the simpler option.
