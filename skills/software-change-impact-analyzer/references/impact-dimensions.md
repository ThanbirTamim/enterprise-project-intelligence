# Impact dimensions

- **Modules/subsystems** touching the changed code directly.
- **APIs** whose contract (request/response shape, status codes, side effects) changes.
- **Workflows** whose steps rely on the changed behavior.
- **Data entities** whose schema or semantics change, and anything reading/writing them.
- **Tests** that exercise the changed code path.
- **Documentation** describing the changed behavior, including diagrams.
- **External dependencies/integrations** that assume the previous behavior.
- **Security boundaries** that might be weakened or strengthened by the change.
