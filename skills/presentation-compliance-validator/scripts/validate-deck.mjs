#!/usr/bin/env node
import { pathToFileURL } from "node:url";
/**
 * Deterministic presentation compliance checks against a generic rule schema
 * (see references/rule-schema.md). Pure function, no network/model calls.
 *
 * Expected deck shape:
 *   { slides: [ { title, bullets: [string], hasFooterOrPageNumber, hasNumericClaim,
 *                 citationsPresent, notes } ], sections: [string] }
 */

export function validateDeck(deck, rules) {
  const findings = [];
  const humanReview = [];

  const blocking = new Set(rules.blockingRuleIds || []);

  // Required sections
  if (rules.requiredSections) {
    const sections = new Set(deck.sections || []);
    for (const s of rules.requiredSections) {
      if (!sections.has(s)) {
        findings.push({
          ruleId: "required-sections",
          severity: blocking.has("required-sections") ? "blocking" : "recommendation",
          slide: null,
          finding: `Required section "${s}" not found in deck.`,
          correctiveAction: `Add a "${s}" section/slide.`,
        });
      }
    }
  }

  (deck.slides || []).forEach((slide, idx) => {
    const slideNum = idx + 1;

    if (rules.requireTitleOnEverySlide && !slide.title) {
      findings.push({
        ruleId: "require-title", severity: blocking.has("require-title") ? "blocking" : "recommendation",
        slide: slideNum, finding: "Slide has no title.", correctiveAction: "Add a slide title.",
      });
    }

    if (typeof rules.maxBulletsPerSlide === "number" && (slide.bullets || []).length > rules.maxBulletsPerSlide) {
      findings.push({
        ruleId: "max-bullets", severity: blocking.has("max-bullets") ? "blocking" : "recommendation",
        slide: slideNum,
        finding: `Slide has ${slide.bullets.length} bullets; limit is ${rules.maxBulletsPerSlide}.`,
        correctiveAction: "Split into multiple slides or move detail to an appendix/speaker notes.",
      });
    }

    if (rules.requireFooterOrPageNumber && !slide.hasFooterOrPageNumber) {
      findings.push({
        ruleId: "require-footer", severity: blocking.has("require-footer") ? "blocking" : "recommendation",
        slide: slideNum, finding: "Slide missing footer/page number.", correctiveAction: "Add a footer or page number.",
      });
    }

    if (rules.requireCitationOnNumericClaims && slide.hasNumericClaim && !slide.citationsPresent) {
      findings.push({
        ruleId: "citation-on-numeric-claim",
        severity: blocking.has("citation-on-numeric-claim") ? "blocking" : "recommendation",
        slide: slideNum,
        finding: "Slide states a numeric claim without a citation or illustrative-data label.",
        correctiveAction: "Add a source citation, or label the figure as illustrative/synthetic.",
      });
    }
  });

  // Palette / typography: only checkable if the deck actually exposes these properties.
  for (const key of ["palette", "typography"]) {
    if (rules[key]) {
      if (deck[key]) {
        for (const [prop, expected] of Object.entries(rules[key])) {
          const actual = deck[key][prop];
          if (actual && actual !== expected) {
            findings.push({
              ruleId: `${key}-${prop}`, severity: blocking.has(`${key}-${prop}`) ? "blocking" : "recommendation",
              slide: null, finding: `${key}.${prop} is "${actual}", expected "${expected}".`,
              correctiveAction: `Update ${key}.${prop} to match the guideline.`,
            });
          }
        }
      } else {
        findings.push({
          ruleId: `${key}-not-checkable`, severity: "info", slide: null,
          finding: `Deck format does not expose "${key}" metadata.`,
          correctiveAction: `Not checkable from this format; verify manually.`,
        });
      }
    }
  }

  for (const item of rules.humanReviewOnly || []) {
    humanReview.push({ ruleId: item, note: "Semantic/visual judgment required; not auto-checked." });
  }

  const blockingFailures = findings.filter((f) => f.severity === "blocking");
  return {
    pass: blockingFailures.length === 0,
    findings,
    humanReview,
    blockingFailureCount: blockingFailures.length,
  };
}

async function main() {
  const [deckPath, rulesPath] = process.argv.slice(2);
  if (!deckPath || !rulesPath) {
    console.error("Usage: node validate-deck.mjs <deck.json> <rules.json>");
    process.exit(1);
  }
  const fs = await import("node:fs");
  const deck = JSON.parse(fs.readFileSync(deckPath, "utf8"));
  const rules = JSON.parse(fs.readFileSync(rulesPath, "utf8"));
  console.log(JSON.stringify(validateDeck(deck, rules), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
