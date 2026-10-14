# Evaluation guide

## What can be checked deterministically

- Skill structure validity (`node scripts/cli.mjs validate`).
- Feasibility score arithmetic and blocker enforcement (`scripts/lib` + tests).
- Presentation rule compliance for properties the deck format actually exposes.
- Markdown/HTML structural well-formedness.
- Presence of secret-shaped values / local paths pre-release.

## What requires human or AI-assisted review

- Whether a reconstructed architecture diagram is actually accurate (requires a human familiar with
  the real system, or a second independent pass with code access).
- Whether a drafted document/slide's prose is clear, well-organized, and free of subtly incorrect
  paraphrasing of cited evidence.
- Visual/aesthetic presentation quality (balance, diagram clarity) — flagged by
  `presentation-compliance-validator` as `humanReviewOnly`, never auto-passed.
- Whether an AI feature recommendation's business-value score is realistic for the actual
  organization (the scoring framework structures the judgment; it does not replace it).

## Suggested evaluation loop for a real project

1. Run discovery + reverse engineering; have a human familiar with the project spot-check a sample
   of extracted facts against the real system.
2. Run the AI integration planner; have the data owner and a security reviewer check the opportunity
   matrix's data-availability and security-risk fields before any pilot starts.
3. For a shipped pilot, measure the metrics defined in the pilot's own `AI_EVALUATION_FRAMEWORK.md`
   output against the baseline recorded before the pilot — never declare success without a measured
   baseline comparison.

## Never do this

- Never treat "the model's output looked plausible" as evidence of correctness.
- Never skip the human spot-check step because the automated structural checks passed — structural
  validity and factual/business correctness are different things.
