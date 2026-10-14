# Secure integration pattern checklist

For every shortlisted AI feature, document each of the following before it is approved for a pilot.
Treat all retrieved documents and user-supplied content as untrusted input throughout.

- **Entry point** — where in the existing application the feature is invoked (UI action, API route,
  scheduled job).
- **Existing components involved** — name the real modules/services the feature touches.
- **Proposed new components** — keep this list as short as the architecture-alternatives comparison
  justifies.
- **Data flow** — draw/describe exactly what data leaves the application boundary, to where, and
  under what agreement.
- **Authentication** — how the calling user/service is authenticated to the AI feature itself.
- **Authorization** — how the feature enforces that the caller may see the data/take the action
  involved; never rely on the model to self-enforce permissions.
- **Access-controlled retrieval** — for RAG/search features, retrieval must filter by the same
  permissions the underlying documents already have; verify this with a test case using a
  low-privilege user.
- **Input validation** — bound size/type of inputs; reject malformed input before it reaches a model.
- **Prompt-injection defenses** — treat retrieved/user content as data, not instructions; constrain
  what the model is allowed to do with embedded instructions found in untrusted content; validate
  that tool-calling features cannot be redirected by injected text.
- **Output validation** — validate structure (e.g., schema-check extracted JSON); do not execute or
  render model output as code/markup without sanitization.
- **Timeouts and retries** — define both, with a safe fallback on exhaustion.
- **Rate limiting** — protect both cost and shared downstream systems.
- **Audit logging** — log inputs/outputs/decisions sufficient for a security/privacy review, while
  respecting data-minimization requirements (do not log more sensitive data than necessary).
- **Monitoring** — track latency, error rate, cost, and (where feasible) output-quality signals.
- **Cost controls** — a hard budget/circuit breaker, not just a dashboard.
- **Fallback behavior** — a defined non-AI fallback when the AI component is unavailable or
  low-confidence.
- **Feature flags** — ability to disable the feature instantly without a deploy.
- **Rollback** — a tested path back to the pre-AI behavior.
- **Human approval** — required explicitly for any action that is irreversible, high-impact, or
  touches sensitive data; name who approves and when.
