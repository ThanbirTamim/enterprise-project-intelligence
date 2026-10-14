# Architecture

## Design principles

- **Skills are instructions, not a runtime.** Each `skills/<name>/SKILL.md` tells an AI agent what
  to do, when, with what inputs, and what evidence/anti-fabrication rules apply. The agent (not this
  repository) performs file access, model inference, and tool calls, subject to its own permissions.
- **Deterministic logic lives in scripts.** Anything that can be checked mechanically (file
  inventory, skill-structure validation, feasibility-score arithmetic and the blocker rule,
  presentation rule checks, Markdown rendering, secret scanning) is implemented as a small,
  dependency-free Node.js module with a corresponding test — not left to model judgment.
- **Model inference is optional and provider-agnostic.** No skill or script requires a specific
  hosted LLM to run its deterministic parts. Where a skill's procedure benefits from model reasoning
  (e.g., summarizing evidence, drafting prose), that is the responsibility of whichever AI agent is
  running the skill; this toolkit does not bundle or call any model API itself.
- **Public/private separation is structural.** `.gitignore`/`.npmignore` exclude
  `.local-knowledge/`, `.private/`, and any real project corpus by convention; skills are instructed
  to write project-specific output outside the repository; `scripts/release-audit.mjs` double-checks
  before any release.

## Component map

```
skills/<name>/SKILL.md         Agent instructions (purpose, inputs, procedure, evidence rules)
skills/<name>/references/*.md  Supporting reference material loaded only when relevant (progressive
                                disclosure — not everything is in SKILL.md itself)
skills/<name>/scripts/*.mjs    Deterministic helper logic specific to that skill
scripts/lib/skills.mjs         Shared skill discovery/validation used by scripts/cli.mjs and tests
scripts/cli.mjs                Thin CLI: list / validate / inventory / release-audit
scripts/release-audit.mjs      Public-release confidentiality/secret safeguard
templates/                     Blank, reusable templates for cross-skill artifacts
examples/synthetic-inventory-system/   Fully fictional worked example end-to-end
tests/                         node:test suite over the deterministic scripts and skill structure
```

## Why no graph database, vector database, or orchestration framework by default

Part A/B of the project brief explicitly calls for starting with a lightweight structured
representation and introducing heavier infrastructure only when a specific project's requirements
justify it. This repository follows that rule for itself: the knowledge model is plain JSON records
(`docs/KNOWLEDGE_MODEL.md`), and `enterprise-ai-integration-planner` applies the same anti-
overengineering rule when planning for the *target* project
(`skills/enterprise-ai-integration-planner/references/architecture-alternatives.md`).
