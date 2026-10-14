# Security Policy

## Reporting a vulnerability

If you believe you've found a security issue in this toolkit (e.g., a prompt-injection bypass in a
skill's instructions, a secret-scanning gap in `scripts/release-audit.mjs`, or a path-traversal issue
in the inventory scripts), please open a private report through the repository's security advisory
feature rather than a public issue, and avoid including any real confidential data in the report.

## Scope and limitations

- This toolkit's `scripts/release-audit.mjs` is a **safeguard, not a guarantee**. It performs
  pattern-based scanning for secret-shaped values and local filesystem paths; it cannot prove the
  complete absence of confidential content. Human review is required before any release.
- Skills in `skills/` are instructions for an AI agent, not sandboxed code; they rely on the host
  agent's own tool permissions and sandboxing for actual file/network access.
- No skill in this toolkit should be configured to let an AI agent bypass an existing application's
  authentication/authorization or take irreversible actions without human approval — see
  `skills/enterprise-ai-integration-planner/references/security-patterns.md`.

## Supported versions

Only the latest `main` branch state is supported while this project is pre-1.0 and unpublished.
