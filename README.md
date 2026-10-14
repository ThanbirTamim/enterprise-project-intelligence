```
 ███████╗██████╗ ██╗
 ██╔════╝██╔══██╗██║
 █████╗  ██████╔╝██║
 ██╔══╝  ██╔══██╗██║
 ███████╗██║  ██║██║
 ╚══════╝╚═╝  ╚═╝╚═╝
 Enterprise Project Intelligence & AI Integration Agent
 ──────────────────────────────────────────────────────
 Evidence-grounded reverse engineering + AI opportunity planning,
 as a reusable, project-agnostic Agent Skills toolkit.
```

<p align="center">
  <a href="https://www.npmjs.com/package/@thanbir-tamim/enterprise-project-intelligence-agent"><img src="https://img.shields.io/npm/v/@thanbir-tamim/enterprise-project-intelligence-agent?color=cb3837&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@thanbir-tamim/enterprise-project-intelligence-agent"><img src="https://img.shields.io/npm/dm/@thanbir-tamim/enterprise-project-intelligence-agent?color=cb3837" alt="npm downloads"></a>
  <a href="https://github.com/ThanbirTamim/enterprise-project-intelligence/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="License"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white" alt="Node >= 18"></a>
  <img src="https://img.shields.io/badge/dependencies-zero-brightgreen" alt="Zero required dependencies">
  <img src="https://img.shields.io/badge/skills-10-blueviolet" alt="10 Agent Skills">
  <img src="https://img.shields.io/badge/tests-23%2F23%20passing-success" alt="23/23 tests passing">
</p>

<p align="center"><strong>⭐ If this toolkit saves you a round of "where should we even put AI in this app?" meetings, consider starring the repo.</strong></p>

---

## What is this?

A **project-agnostic, organization-agnostic Agent Skills toolkit** — a set of instructions, reference
scripts, and templates that let an AI coding agent:

> **Ingest → Reconstruct → Ask → Plan AI → Document → Present → Audit → Maintain**

...for *any* software project you point it at, grounding every material claim in cited evidence
instead of plausible-sounding guesses.

It ships **zero required third-party dependencies**, works with **any AI agent that supports the
Agent Skills convention** (a `SKILL.md` with YAML frontmatter per skill), and treats "should we even
use AI here?" as a real question with a real non-AI alternative — not a foregone conclusion.

```
 docs/code  ──▶  project-documentation-discovery  ──▶  evidence-index.json
                            │
                            ▼
                 software-reverse-engineering  ──▶  architecture + data model
                            │
          ┌─────────────────┼──────────────────────┐
          ▼                 ▼                       ▼
  project-knowledge-   enterprise-ai-        documentation-quality-
     assistant         integration-planner        auditor
   (cited Q&A)      (opportunities, scores,    (contradictions,
                     roadmap, security)         stale docs, gaps)
          │                 │                       │
          └─────────────────┼───────────────────────┘
                            ▼
      technical-document-generator · corporate-presentation-generator
                 (Markdown / HTML / decks, all cited)
```

## Table of contents

- [Why this exists](#why-this-exists)
- [Quick start](#quick-start)
- [The 10 skills, in detail](#the-10-skills-in-detail)
- [Repository layout](#repository-layout)
- [Confidentiality by construction](#confidentiality-by-construction)
- [Testing & validation](#testing--validation)
- [Installation](#installation)
- [Documentation](#documentation)
- [Status](#status)
- [Contributing & license](#contributing--license)

## Why this exists

Most "apply AI to my project" advice is generic. This toolkit instead:

- 🔎 **Grounds every material claim** in cited evidence pulled from *your* project's own corpus —
  not from the model's general knowledge about "systems like this."
- ⚖️ **Treats AI as a hypothesis, not a default.** Every proposed AI feature is compared against the
  simplest viable non-AI alternative before it's recommended.
- 🧮 **Separates deterministic checks from AI judgment.** Feasibility-score arithmetic, the
  non-overridable security-blocker rule, presentation-rule matching, Markdown rendering, and secret
  scanning are all plain, tested Node.js code — not left to a model to "probably get right."
- 🔒 **Keeps private project data and public toolkit code structurally separate** — nothing you feed
  it ends up in this repository, and a release-audit script scans for secrets/paths before anything
  is ever published.
- 🧩 **Composable, not monolithic.** Ten independent skills you can mix and match, each with its own
  purpose, inputs, outputs, evidence rules, and anti-fabrication rules.

## Quick start

```bash
# Clone it
git clone https://github.com/ThanbirTamim/enterprise-project-intelligence.git
cd enterprise-project-intelligence

# Or install the published package
npm install -g @thanbir-tamim/enterprise-project-intelligence-agent

# See what's inside
node scripts/cli.mjs list

# Validate skill structure (frontmatter, required sections, referenced files all exist)
node scripts/cli.mjs validate

# Point it at a real documentation corpus (writes to a private directory, never into this repo)
node scripts/cli.mjs inventory /path/to/your/project/docs --out ./.local-knowledge/my-project

# Run the full test suite
npm test

# Run the public-release confidentiality/secret audit
node scripts/cli.mjs release-audit
```

Then point your AI coding agent at the `skills/` directory (or copy individual `skills/<name>/`
folders into your agent's own skills directory). Start with `project-documentation-discovery`, then
`software-reverse-engineering` and/or `project-knowledge-assistant`, then
`enterprise-ai-integration-planner`. Full walkthrough in [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md).

---

## The 10 skills, in detail

Each skill is a self-contained `SKILL.md` (purpose, required inputs, execution procedure, expected
outputs, evidence requirements, anti-fabrication rules, error handling, security considerations) plus
`references/` material and, where determinism matters, a tested `scripts/*.mjs` helper.

### 1. 📂 `project-documentation-discovery`
**The entry point for any new project.** Walks a documentation/code corpus, classifies every file by
format, extracts headings/tables/structure for what it can genuinely parse (Markdown, text, JSON,
YAML, CSV, HTML), and **honestly** flags what it can't (DOCX/PPTX/PDF/Keynote/Pages) instead of
silently skipping or falsely claiming success.
- **Inputs**: a corpus path, optional project profile (confidentiality level, excluded paths).
- **Outputs**: `inventory.json`, `evidence-index.json`, `INVENTORY_SUMMARY.md`.
- **Reference script**: [`scripts/inventory.mjs`](skills/project-documentation-discovery/scripts/inventory.mjs) — zero dependencies, redacts secret-shaped strings before indexing.

### 2. 💬 `project-knowledge-assistant`
Answers questions about the target project **strictly from the evidence index** — every material
claim is cited with a `source_location`, every inference is labeled as an inference, and
contradictions between sources are surfaced, never silently resolved.
- **Inputs**: evidence index + the user's question.
- **Outputs**: a cited answer, confidence labels (`documented` / `verified-in-code` / `inferred` /
  `unverified-claim` / `superseded`), or an explicit "not found in the evidence."

### 3. 🏗️ `software-reverse-engineering`
Reconstructs architecture, modules, APIs, data model, and workflows from whatever evidence is
available — reconciling documentation against actual code when both exist, and clearly separating
`verified-in-code` facts from `documented-only` claims from honest inferences.
- **Outputs**: module map, API/route inventory, data model summary, workflow reconstructions,
  documentation-vs-code discrepancy list, and an explicit "could not verify" section.

### 4. 🤖 `enterprise-ai-integration-planner` — the flagship skill
Discovers, scores, and plans **AI integration opportunities for any project — including ones with
zero existing AI.** Every proposal is compared against the simplest non-AI alternative first. Scoring
is an eight-dimension, published weighting formula with a **non-overridable blocker rule**: a critical
security/privacy/legal/authorization blocker forces `blocked`/`rework-required` *no matter how high
the weighted score is* — enforced in code, not just prose, and covered by automated tests.
- **Reference script**: [`scripts/score-opportunity.mjs`](skills/enterprise-ai-integration-planner/scripts/score-opportunity.mjs) — pure function, fully reproducible.
- **Generates**: `AI_INTEGRATION_STRATEGY.md`, `AI_OPPORTUNITY_MATRIX.md`, `AI_FEASIBILITY_ASSESSMENT.md`,
  `AI_REFERENCE_ARCHITECTURE.md`, `AI_SECURITY_AND_GOVERNANCE.md`, `AI_EVALUATION_FRAMEWORK.md`,
  `AI_IMPLEMENTATION_ROADMAP.md`, `AI_PILOT_PROPOSAL.md`, `AI_INTEGRATION_FAQ.md`, a risk register,
  and a pilot acceptance checklist.
- **Try it**: [`examples/synthetic-inventory-system/ai-opportunity-matrix/`](examples/synthetic-inventory-system/ai-opportunity-matrix/AI_OPPORTUNITY_MATRIX.md) — a fully worked, fictional example, including a reproducible score showing the blocker rule in action.

### 5. 🖼️ `corporate-presentation-generator`
Builds evidence-backed slide decks from project evidence, against **your** supplied corporate
guidelines (or a neutral, original default style guide — never a real company's proprietary rules).
Every factual slide is cited or explicitly labeled illustrative.

### 6. ✅ `presentation-compliance-validator`
Converts configurable presentation guidelines into structured rules and validates a deck against
them — **specific, itemized violations and corrective actions**, never a vague aggregate score.
Honestly reports `not-checkable-from-this-format` rather than guessing a pass when the deck
representation doesn't expose a property (e.g., no color/font metadata).
- **Reference script**: [`scripts/validate-deck.mjs`](skills/presentation-compliance-validator/scripts/validate-deck.mjs).

### 7. 📄 `technical-document-generator`
Renders structured findings from the other skills into consistent Markdown/HTML artifacts (DOCX/PPTX
only through a verified exporter — never claimed without one), preserving every citation attached to
the source finding.
- **Reference script**: [`scripts/render-markdown-to-html.mjs`](skills/technical-document-generator/scripts/render-markdown-to-html.mjs) — a dependency-free Markdown → HTML renderer.

### 8. 🩺 `documentation-quality-auditor`
Finds contradictions, stale documents, broken internal references, missing required sections, and
unsupported claims across a documentation corpus — always reporting both sides of a contradiction,
never auto-resolving.

### 9. 🌊 `software-change-impact-analyzer`
Traces the likely effects of a proposed change across modules, APIs, workflows, tests, data entities,
and documentation — scoping confidence honestly (first-order impacts vs. lower-confidence second-order
effects) rather than implying full coverage.

### 10. 🎓 `engineering-knowledge-transfer`
Generates onboarding guides, operational runbooks, handover documents, and troubleshooting guides
from the same evidence base — with explicit `TODO: confirm with current operator` markers instead of
fabricated procedures when the evidence doesn't cover something.

> 📑 One-page table version: [`docs/SKILL_CATALOG.md`](docs/SKILL_CATALOG.md). Live version straight
> from each skill's frontmatter: `node scripts/cli.mjs list`.

---

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

## Confidentiality by construction

- No internal project name, organization name, proprietary feature, internal URL, file path, or
  employee name appears anywhere in this repository.
- All examples use a fictional **"Synthetic Inventory Platform."**
- The default presentation style guide is original, neutral, placeholder-branded content.
- [`scripts/release-audit.mjs`](scripts/release-audit.mjs) scans for secret-shaped values, local
  filesystem paths, and configurable private terms before any release — reporting **file, line, and
  category only, never the matched value.** Safeguard, not a guarantee; human review is still
  required.

## Testing & validation

```bash
npm test              # 23/23 passing — node:test, zero test-framework dependency
npm run validate       # structural validation of every skill
npm run release-audit  # secret/path scan before any release
npm run pack:dry-run   # inspect exactly what would be published
```

See [`docs/TESTING_STRATEGY.md`](docs/TESTING_STRATEGY.md) for what's covered automatically versus
what needs human/AI-assisted review ([`docs/EVALUATION_GUIDE.md`](docs/EVALUATION_GUIDE.md)).

## Installation

Full instructions: [`docs/INSTALLATION.md`](docs/INSTALLATION.md) · [`docs/QUICK_START.md`](docs/QUICK_START.md)

```bash
npm install -g @thanbir-tamim/enterprise-project-intelligence-agent
epi-agent list
```

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) | End-to-end workflow across all 10 skills |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Design principles, component map |
| [`docs/SKILL_CATALOG.md`](docs/SKILL_CATALOG.md) | One-page skill reference table |
| [`docs/KNOWLEDGE_MODEL.md`](docs/KNOWLEDGE_MODEL.md) · [`docs/EVIDENCE_AND_PROVENANCE.md`](docs/EVIDENCE_AND_PROVENANCE.md) | How evidence/citations work |
| [`docs/SUPPORTED_FORMATS.md`](docs/SUPPORTED_FORMATS.md) | What's actually tested vs. aspirational |
| [`docs/SECURITY_MODEL.md`](docs/SECURITY_MODEL.md) | Threat model + safeguards |
| [`docs/IMPLEMENTATION_REPORT.md`](docs/IMPLEMENTATION_REPORT.md) | Full build report: what was implemented, tested, verified |
| [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) | Common issues and fixes |

## Status

Published on npm as
[`@thanbir-tamim/enterprise-project-intelligence-agent`](https://www.npmjs.com/package/@thanbir-tamim/enterprise-project-intelligence-agent).
See [`CHANGELOG.md`](CHANGELOG.md) for release history and
[`docs/IMPLEMENTATION_REPORT.md`](docs/IMPLEMENTATION_REPORT.md) for the detailed build/verification
report. Future releases are published deliberately, never automatically, following the checklist in
[`docs/INSTALLATION.md`](docs/INSTALLATION.md).

## Contributing & license

Contributions welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md) (ground rule #1: no confidential
content, ever) and [`SECURITY.md`](SECURITY.md) for vulnerability reporting.

Licensed under [Apache-2.0](LICENSE).

---

<p align="center"><em>Built for engineers who want an honest answer to "where should AI go in this system?" — including when the honest answer is "nowhere, yet."</em></p>
