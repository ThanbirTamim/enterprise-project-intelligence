# Security model

## Threat model summary

| Concern | Mitigation |
|---|---|
| Confidential project data leaking into the public repo | Skills instructed to write project output outside the repo; `.gitignore`/`.npmignore`; `release-audit.mjs`. |
| Secrets embedded in ingested documents/config | `inventory.mjs` redacts secret-shaped strings before persisting to the evidence index. |
| Prompt injection via retrieved documents (RAG features the planner designs for *target* projects) | `enterprise-ai-integration-planner/references/security-patterns.md` requires treating retrieved/user content as untrusted data, never as instructions. |
| AI feature bypassing application permissions | Explicit rule: access-controlled retrieval must inherit existing permissions; agents must never self-authorize sensitive actions. |
| Irreversible autonomous actions | Human-approval requirement baked into the security-pattern checklist and the non-overridable blocker list in `feasibility-scoring.md`. |
| Overclaiming format support or AI accuracy | `SUPPORTED_FORMATS.md` "Verified means tested" policy; `enterprise-ai-integration-planner` anti-fabrication rules against inventing metrics. |
| Accidental publication of private findings | Nothing in this toolkit publishes/releases automatically; `npm run pack:dry-run` + manual review required before any real release. |

## release-audit.mjs scope and limitation

`scripts/release-audit.mjs` scans in-repo text files for:
- secret-shaped values (private key blocks, AWS-style access key IDs, bearer tokens, credentialed
  connection strings, long high-entropy strings);
- local filesystem paths that look like a specific user's machine (`/Users/<name>/...`,
  `/home/<name>/...`);
- a configurable, currently-empty list of private terms a consuming project can populate locally
  (never shipped with any real private term).

It reports **file, line number, and category only** — it never prints the matched value. This is a
safeguard, not proof that a release is safe; human review of the dry-run package contents is always
required.

## Model/provider data flow

This toolkit does not call any model API itself. If a consuming AI agent uses a hosted model while
running these skills, the agent's own data-flow and provider documentation governs what data is
sent externally — this toolkit's skills only instruct the agent on *what* to do and *what rules to
follow*, including treating retrieved/untrusted content carefully and never fabricating facts.
