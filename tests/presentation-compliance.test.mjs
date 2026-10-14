import { test } from "node:test";
import assert from "node:assert/strict";
import { validateDeck } from "../skills/presentation-compliance-validator/scripts/validate-deck.mjs";

const rules = {
  requiredSections: ["Executive Summary", "Risks and Decisions"],
  maxBulletsPerSlide: 3,
  requireTitleOnEverySlide: true,
  requireFooterOrPageNumber: true,
  requireCitationOnNumericClaims: true,
  blockingRuleIds: ["required-sections", "max-bullets"],
  humanReviewOnly: ["visual-balance"],
};

test("flags a missing required section as a blocking finding", () => {
  const deck = { sections: ["Executive Summary"], slides: [] };
  const result = validateDeck(deck, rules);
  assert.equal(result.pass, false);
  assert.ok(result.findings.some((f) => f.ruleId === "required-sections" && f.severity === "blocking"));
});

test("flags too many bullets on a slide", () => {
  const deck = {
    sections: ["Executive Summary", "Risks and Decisions"],
    slides: [{ title: "T", bullets: ["a", "b", "c", "d"], hasFooterOrPageNumber: true, hasNumericClaim: false, citationsPresent: true }],
  };
  const result = validateDeck(deck, rules);
  assert.equal(result.pass, false);
  assert.ok(result.findings.some((f) => f.ruleId === "max-bullets"));
});

test("flags a numeric claim without a citation", () => {
  const deck = {
    sections: ["Executive Summary", "Risks and Decisions"],
    slides: [{ title: "T", bullets: ["one"], hasFooterOrPageNumber: true, hasNumericClaim: true, citationsPresent: false }],
  };
  const result = validateDeck(deck, rules);
  assert.ok(result.findings.some((f) => f.ruleId === "citation-on-numeric-claim"));
});

test("palette rule is reported not-checkable when the deck format lacks palette metadata", () => {
  const deck = { sections: ["Executive Summary", "Risks and Decisions"], slides: [] };
  const result = validateDeck(deck, { ...rules, palette: { primary: "#000000" } });
  const finding = result.findings.find((f) => f.ruleId === "palette-not-checkable");
  assert.ok(finding);
  assert.equal(finding.severity, "info");
});

test("a fully compliant deck passes with no blocking findings", () => {
  const deck = {
    sections: ["Executive Summary", "Risks and Decisions"],
    slides: [{ title: "T", bullets: ["a"], hasFooterOrPageNumber: true, hasNumericClaim: false, citationsPresent: true }],
  };
  const result = validateDeck(deck, rules);
  assert.equal(result.pass, true);
  assert.equal(result.blockingFailureCount, 0);
});

test("humanReviewOnly items always appear in humanReview output, never auto-passed", () => {
  const deck = { sections: ["Executive Summary", "Risks and Decisions"], slides: [] };
  const result = validateDeck(deck, rules);
  assert.ok(result.humanReview.some((h) => h.ruleId === "visual-balance"));
});
