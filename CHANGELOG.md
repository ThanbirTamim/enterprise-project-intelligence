# Changelog

## 0.1.0 — Initial local build (unreleased)

- Added 10 composable Agent Skills: `project-documentation-discovery`,
  `project-knowledge-assistant`, `software-reverse-engineering`,
  `enterprise-ai-integration-planner`, `corporate-presentation-generator`,
  `presentation-compliance-validator`, `technical-document-generator`,
  `documentation-quality-auditor`, `software-change-impact-analyzer`,
  `engineering-knowledge-transfer`.
- Added reusable, dependency-free Node.js scripts: documentation inventory, feasibility scoring,
  presentation compliance validation, Markdown-to-HTML rendering, and a public-release audit
  (secret-shaped value + local-path scanning).
- Added blank templates for the AI opportunity matrix, pilot proposal, and risk register, plus a
  generic presentation-rules schema example.
- Added a fully synthetic worked example (`examples/synthetic-inventory-system/`).
- Added automated tests (`node:test`) covering skill structure validation, inventory extraction,
  feasibility scoring (including the non-overridable blocker rule), presentation compliance
  checking, Markdown rendering, and release-audit secret detection.
- Added toolkit documentation under `docs/`.
- Not yet published to any package registry. See `docs/IMPLEMENTATION_REPORT.md` for status and
  the release-preparation checklist.
