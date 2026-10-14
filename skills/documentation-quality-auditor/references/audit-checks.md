# Audit checks reference

| Check | Method | Severity default |
|---|---|---|
| Contradiction | Same entity/topic, differing statements across two sources | high |
| Broken internal reference | Linked path does not resolve within the corpus | high |
| Internal-looking external link | URL matches private-hostname/IP heuristics | medium (confidentiality) |
| Missing required section | Document type's expected heading not found | medium |
| Stale document | Modified-time older than threshold with no recent-review marker | low-medium |
| Unsupported claim | Strong/numeric assertion with no citation anywhere in the document | medium |

Severities are defaults; a consuming project may override them via its own configuration, but the
auditor must always report the finding even when severity is downgraded — never drop it silently.
