# Reconstruction method

1. Start from documentation to form hypotheses about structure.
2. Verify each hypothesis against code when code is available; downgrade to `documented-only` when
   it is not.
3. Prefer breadth-first module discovery before depth-first tracing of any single workflow, so
   partial-time budgets still produce a usable map.
4. When tracing a workflow end-to-end, note every layer boundary crossed (UI → API → service → data)
   and the mechanism (HTTP call, direct function call, message/queue, scheduled job).
5. Record every assumption made due to missing code/documentation in a dedicated "Assumptions" list,
   not mixed into the main findings.
