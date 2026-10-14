# Knowledge model

A lightweight, reusable entity model used across skills to represent a target project. This is
intentionally a plain structured representation (JSON records with typed fields) rather than a graph
database — introduce a graph database only if a specific project's query needs actually justify it.

## Entity types

`Requirement`, `ActorOrRole`, `ModuleOrSubsystem`, `UiComponentOrRoute`, `Api`, `Service`,
`DatabaseEntity`, `BusinessRule`, `Workflow`, `ExternalDependency`, `InfrastructureComponent`,
`ArchitecturalDecision`, `SecurityBoundary`, `Test`, `KnownDefect`, `TechnicalRisk`,
`DocumentationReference`.

## Fact record shape

```json
{
  "id": "fact-0001",
  "statement": "Human-readable statement of the fact",
  "entity": "ModuleOrSubsystem:billing-engine",
  "relationship": "depends-on",
  "source_path": "docs/architecture.md",
  "source_location": "docs/architecture.md#billing-engine",
  "evidence_type": "text",
  "confidence": "documented",
  "last_verified": "2024-01-01T00:00:00Z",
  "status": "active"
}
```

`status` is one of: `active`, `superseded`, `contradicted`, `unverified`.

## Rules

- Facts are never invented to make the model look complete; an absent fact is represented as an
  explicit gap in the relevant report, not a silently-filled placeholder.
- Contradicting facts about the same entity/relationship are both retained with `status:
  contradicted` and surfaced to the user, never auto-resolved.
- `last_verified` is updated only when the fact is actually re-checked against the corpus (e.g., on
  re-scan), not on every tool run.

## Relationship to the evidence index

The knowledge model's `source_path`/`source_location` fields reuse the same conventions as
`EVIDENCE_AND_PROVENANCE.md`; a fact is only as trustworthy as its evidence record.
