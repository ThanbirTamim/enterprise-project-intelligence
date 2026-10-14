# Presentation rule schema (generic)

```json
{
  "name": "string - name of the guideline set (user-supplied)",
  "requiredSections": ["string, e.g. Executive Summary", "Risks and Decisions"],
  "maxBulletsPerSlide": 6,
  "requireTitleOnEverySlide": true,
  "requireFooterOrPageNumber": true,
  "requireCitationOnNumericClaims": true,
  "palette": { "primary": "#RRGGBB", "text": "#RRGGBB", "background": "#RRGGBB", "risk": "#RRGGBB" },
  "typography": { "titleFont": "string", "bodyFont": "string" },
  "blockingRuleIds": ["required-sections", "max-bullets"],
  "humanReviewOnly": ["visual-balance", "diagram-aesthetics", "logo-placement"]
}
```

- `requiredSections`, `maxBulletsPerSlide`, `requireTitleOnEverySlide`, `requireFooterOrPageNumber`,
  and `requireCitationOnNumericClaims` are deterministically checkable and should be in
  `blockingRuleIds` if the organization wants them enforced as hard failures.
- `palette`/`typography` are checkable only when the deck format exposes those properties; otherwise
  the validator reports `not-checkable-from-this-format`.
- `humanReviewOnly` entries are never auto-passed or auto-failed; they always appear in the
  human-review list.
