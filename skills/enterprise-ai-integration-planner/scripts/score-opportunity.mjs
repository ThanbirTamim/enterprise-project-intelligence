#!/usr/bin/env node
import { pathToFileURL } from "node:url";
/**
 * Transparent, reproducible feasibility scoring for one AI opportunity.
 * Implements the weighting formula and non-overridable-blocker rule documented in
 * references/feasibility-scoring.md. This is a pure function with no network/model calls:
 * all inputs are scores and blocker flags the caller (human or agent) assigns from evidence.
 *
 * Usage (CLI):
 *   node score-opportunity.mjs '{"businessValue":4,"dataReadiness":3,...,"blockers":["blocker:no-access-control-on-retrieval"]}'
 *
 * Usage (import):
 *   import { scoreOpportunity } from "./score-opportunity.mjs";
 */

const WEIGHTS = {
  businessValue: 0.20,
  dataReadiness: 0.15,
  integrationFeasibility: 0.15,
  technicalMaturity: 0.10,
  securityReadiness: 0.15,
  evaluationFeasibility: 0.10,
  maintainability: 0.075,
  costEfficiency: 0.075,
};

const STRUCTURAL_BLOCKERS = new Set([
  "blocker:no-authorization-path",
  "blocker:regulatory-prohibition",
]);

const MITIGABLE_BLOCKERS = new Set([
  "blocker:unresolved-pii-exposure",
  "blocker:no-access-control-on-retrieval",
  "blocker:irreversible-autonomous-action",
]);

const KNOWN_BLOCKERS = new Set([...STRUCTURAL_BLOCKERS, ...MITIGABLE_BLOCKERS]);

export function scoreOpportunity(input) {
  const scores = {};
  let weightedSum = 0;
  let weightTotal = 0;
  for (const [dim, weight] of Object.entries(WEIGHTS)) {
    const v = input[dim];
    if (typeof v !== "number" || v < 0 || v > 5) {
      throw new Error(`Dimension '${dim}' must be a number 0-5 (got ${JSON.stringify(v)})`);
    }
    scores[dim] = v;
    weightedSum += v * weight;
    weightTotal += weight;
  }
  const weightedScore = Math.round((weightedSum / weightTotal) * 1000) / 1000;

  const blockers = Array.isArray(input.blockers) ? input.blockers : [];
  for (const b of blockers) {
    if (!KNOWN_BLOCKERS.has(b)) {
      throw new Error(`Unknown blocker '${b}'. Known blockers: ${[...KNOWN_BLOCKERS].join(", ")}`);
    }
  }

  let recommendation;
  let band;
  if (weightedScore >= 3.75) band = "go";
  else if (weightedScore >= 2.5) band = "rework-required";
  else band = "defer";

  const hasStructuralBlocker = blockers.some((b) => STRUCTURAL_BLOCKERS.has(b));
  const hasMitigableBlocker = blockers.some((b) => MITIGABLE_BLOCKERS.has(b));

  if (hasStructuralBlocker) {
    recommendation = "blocked";
  } else if (hasMitigableBlocker) {
    recommendation = "rework-required";
  } else {
    recommendation = band;
  }

  return {
    scores,
    weightedScore,
    band,
    blockers,
    recommendation,
    blockerOverrodeScore: recommendation !== band,
  };
}

function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node score-opportunity.mjs '<json-input>'");
    process.exit(1);
  }
  const input = JSON.parse(arg);
  console.log(JSON.stringify(scoreOpportunity(input), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
