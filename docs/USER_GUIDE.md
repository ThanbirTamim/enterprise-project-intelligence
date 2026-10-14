# User guide

## End-to-end workflow

1. **Discover** — `project-documentation-discovery` builds `inventory.json` and
   `evidence-index.json` for the target project's corpus.
2. **Reverse-engineer** (optional but recommended when code is available) —
   `software-reverse-engineering` reconstructs architecture/data model/workflows, reconciling code
   against documentation.
3. **Ask questions** — `project-knowledge-assistant` answers questions with citations using the
   evidence from steps 1-2.
4. **Plan AI integration** — `enterprise-ai-integration-planner` discovers opportunities, scores
   feasibility, designs architecture/security patterns, and produces an adoption roadmap.
5. **Document** — `technical-document-generator` renders findings into consistent artifacts.
6. **Present** — `corporate-presentation-generator` builds a deck from the same evidence, validated
   by `presentation-compliance-validator` against your own (or the neutral default) style guide.
7. **Maintain** — `documentation-quality-auditor` finds contradictions/staleness/broken references;
   `software-change-impact-analyzer` scopes a proposed change; `engineering-knowledge-transfer`
   produces onboarding/runbook material from the same evidence base.

## Where private output goes

Every skill that produces project-specific findings writes to a private working directory the user
chooses (commonly `.local-knowledge/<project-id>/`), never into this repository's `skills/`,
`templates/`, or `examples/` directories. Only the blank templates and the fully synthetic example
live in the public repository.

## Who answers which question

| Question | Skill |
|---|---|
| "What files/formats do we have and how complete is extraction?" | `project-documentation-discovery` |
| "How does the system actually work / what's the architecture?" | `software-reverse-engineering` |
| "What does the documentation say about X, with sources?" | `project-knowledge-assistant` |
| "Where could AI help, and is it actually a good idea?" | `enterprise-ai-integration-planner` |
| "Write this up as a formal document" | `technical-document-generator` |
| "Build a slide deck for this" | `corporate-presentation-generator` |
| "Does this deck follow our guidelines?" | `presentation-compliance-validator` |
| "Is our documentation accurate/consistent/current?" | `documentation-quality-auditor` |
| "What breaks if we change X?" | `software-change-impact-analyzer` |
| "Help a new engineer/operator get up to speed" | `engineering-knowledge-transfer` |
