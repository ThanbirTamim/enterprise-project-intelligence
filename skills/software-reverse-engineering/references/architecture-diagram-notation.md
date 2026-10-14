# Architecture diagram notation (generic, text-renderable)

Use simple, tool-agnostic notation that can be expressed in Markdown/Mermaid so diagrams stay
reviewable as plain text and do not require a proprietary diagramming tool.

```
[Client / UI] --HTTP--> [API layer] --calls--> [Service: <name>] --reads/writes--> [(Data store)]
```

- Mark unverified edges with a dashed-style annotation, e.g. `-.inferred.->`.
- Group modules in a subsystem using Mermaid `subgraph` blocks when using Mermaid.
- Always include a legend distinguishing `verified-in-code`, `documented-only`, and `inferred`.
