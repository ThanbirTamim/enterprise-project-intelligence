# Enterprise Project Intelligence & AI Integration Agent

A project-agnostic, organization-agnostic **Agent Skills toolkit** that helps an AI assistant:

1. Ingest and inventory a software project's documentation and (optionally) source code.
2. Reconstruct architecture, workflows, APIs, and data model from the available evidence.
3. Answer questions about the project with source citations.
4. Discover, score, and plan **AI integration opportunities** — including for projects with *no*
   existing AI — always comparing against the simplest non-AI alternative, and never letting a high
   score override a critical security/privacy/legal blocker.
5. Generate evidence-backed technical documentation and corporate presentations against
   user-supplied (not hardcoded) style guidelines.
6. Audit documentation quality, trace change impact, and generate onboarding/knowledge-transfer
   material.

This repository ships **skills** (instructions for an AI coding agent), **reference scripts**
(deterministic, dependency-free Node.js helpers), **templates**, and a **synthetic** worked example.
It contains **no real organization's project data, branding, or proprietary guideline text**.

## Why this exists

Most "apply AI to my project" advice is generic. This toolkit instead:

- Grounds every material claim in cited evidence from the user's own project corpus.
- Treats "should we even use AI here?" as a real question with a real non-AI alternative, not a
  foregone conclusion.
- Separates deterministic checks (file inventory, schema validation, compliance rule-matching) from
  AI-assisted judgment, so the parts that can be verified mechanically are verified mechanically.
- Keeps private project data and public toolkit code in separate places by construction.

## Quick start

```bash
# List the available skills
node scripts/cli.mjs list

# Validate skill structure (frontmatter, required sections, referenced files exist)
node scripts/cli.mjs validate

# Inventory a documentation corpus (reports counts; see the skill for persisted output)
node scripts/cli.mjs inventory /path/to/your/project/docs --out ./.local-knowledge/my-project

# Run the public-release confidentiality/secret audit over this repository
node scripts/cli.mjs release-audit
```

Then point your AI coding agent (one that supports the Agent Skills convention — each skill is a
`SKILL.md` with YAML frontmatter) at the `skills/` directory, or install individual skill folders
into your agent's skills directory. Start with `project-documentation-discovery`, then
`software-reverse-engineering` and/or `project-knowledge-assistant`, then
`enterprise-ai-integration-planner`.

## Repository layout

```
skills/                         10 composable Agent Skills (SKILL.md + references/ + scripts/)
templates/                      Blank, reusable templates (opportunity matrix, pilot proposal, ...)
examples/synthetic-inventory-system/   Fully synthetic worked example (fictional data only)
scripts/                        Reusable, dependency-free Node.js CLI + libraries
docs/                           Toolkit documentation (ingestion, security model, catalog, ...)
tests/                          Automated tests (node:test) using synthetic fixtures only
evaluations/                    Evaluation guide placeholders for AI-assisted review quality
```

See `docs/SKILL_CATALOG.md` for a one-page summary of every skill, and
`docs/IMPLEMENTATION_REPORT.md` for the full implementation report.

## Confidentiality by construction

This toolkit was developed using private reference material to understand real-world requirements,
but:

- No internal project name, organization name, proprietary feature, internal URL, file path, or
  employee name appears anywhere in this repository.
- All examples use a fictional "synthetic inventory management platform."
- The default presentation style guide is original, neutral, placeholder-branded content — not any
  company's proprietary guideline.
- `scripts/release-audit.mjs` scans for secret-shaped values, local filesystem paths, and
  configurable private terms before any release, reporting file/line/category **without printing
  the matched value**. This is a safeguard, not a guarantee — human review is still required before
  publishing anything derived from a real project.

## Status

Published on npm as `@thanbir-tamim/enterprise-project-intelligence-agent` (see `package.json` for
the current version). This is an early release (`0.1.x`) — see `docs/IMPLEMENTATION_REPORT.md` for
what has been implemented, tested, and verified so far, and `CHANGELOG.md` for release history.
Future releases are published deliberately, never automatically, following the checklist in
`docs/INSTALLATION.md`.

## License

Apache-2.0 — see `LICENSE`.
