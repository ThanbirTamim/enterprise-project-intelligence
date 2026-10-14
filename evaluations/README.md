# Evaluations

This directory is reserved for evaluation run artifacts (e.g., scoring reproducibility logs,
presentation-compliance regression runs) that a consuming project may want to keep locally.

It is intentionally excluded from the published npm package (see `.npmignore`) and from the
public-release audit's assumptions about publishable content, since evaluation runs against a real
project would contain project-specific data.

See `docs/EVALUATION_GUIDE.md` for what should and should not be automated.
