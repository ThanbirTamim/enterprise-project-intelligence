# Quick start

```bash
git clone <this-repo-url>
cd enterprise-project-intelligence
node scripts/cli.mjs list
node scripts/cli.mjs validate
npm test
```

## Analyze a project

1. Copy `templates/project-profile.example.yaml`, fill it in, and keep the filled copy **outside**
   this repository (e.g., `~/private-work/my-project/project-profile.yaml`).
2. Run the documentation discovery skill (or its reference script directly for a quick inventory):
   ```bash
   node scripts/cli.mjs inventory /path/to/project/docs --out ~/private-work/my-project/.local-knowledge
   ```
3. Point your AI agent at the `project-documentation-discovery` skill to build the full evidence
   index, then at `software-reverse-engineering` and/or `project-knowledge-assistant`.
4. Run `enterprise-ai-integration-planner` to get an opportunity matrix, feasibility scores, and a
   roadmap — all written to your private working directory, not this repository.
5. Optionally generate documentation (`technical-document-generator`) and a presentation
   (`corporate-presentation-generator` + `presentation-compliance-validator`).

See `docs/USER_GUIDE.md` for the full workflow and `docs/SKILL_CATALOG.md` for a one-page skill
reference.
