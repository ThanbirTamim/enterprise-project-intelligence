# Skill catalog

| Skill | Purpose | Key references/scripts |
|---|---|---|
| `project-documentation-discovery` | Inventory and ingest a project corpus; build evidence index | `references/format-matrix.md`, `scripts/inventory.mjs` |
| `project-knowledge-assistant` | Answer questions with citations from the evidence index | `references/citation-format.md`, `references/confidence-levels.md` |
| `software-reverse-engineering` | Reconstruct architecture/data model/workflows from evidence | `references/reconstruction-method.md`, `references/architecture-diagram-notation.md` |
| `enterprise-ai-integration-planner` | Discover, score, and plan AI integration opportunities (flagship skill) | `references/opportunity-catalog.md`, `references/feasibility-scoring.md`, `references/architecture-alternatives.md`, `references/security-patterns.md`, `references/adoption-roadmap.md`, `scripts/score-opportunity.mjs` |
| `corporate-presentation-generator` | Build evidence-backed decks against supplied/default guidelines | `references/default-style-guide.md`, `references/slide-content-patterns.md` |
| `presentation-compliance-validator` | Validate a deck against configurable rules, with specific findings | `references/rule-schema.md`, `scripts/validate-deck.mjs` |
| `technical-document-generator` | Render findings into Markdown/HTML (DOCX/PPTX only if verified) | `references/document-structure.md`, `scripts/render-markdown-to-html.mjs` |
| `documentation-quality-auditor` | Find contradictions, staleness, broken refs, unsupported claims | `references/audit-checks.md`, `scripts/audit-docs.mjs` |
| `software-change-impact-analyzer` | Trace likely effects of a proposed change | `references/impact-dimensions.md` |
| `engineering-knowledge-transfer` | Generate onboarding/runbook/handover/troubleshooting material | `references/learning-path-patterns.md` |

Run `node scripts/cli.mjs list` for a live, generated version of this table sourced directly from
each skill's frontmatter.
