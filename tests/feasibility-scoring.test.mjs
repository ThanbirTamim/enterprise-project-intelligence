import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreOpportunity } from "../skills/enterprise-ai-integration-planner/scripts/score-opportunity.mjs";

const perfectScores = {
  businessValue: 5, dataReadiness: 5, integrationFeasibility: 5, technicalMaturity: 5,
  securityReadiness: 5, evaluationFeasibility: 5, maintainability: 5, costEfficiency: 5,
};

test("perfect scores with no blockers recommend 'go'", () => {
  const result = scoreOpportunity({ ...perfectScores, blockers: [] });
  assert.equal(result.weightedScore, 5);
  assert.equal(result.recommendation, "go");
  assert.equal(result.blockerOverrodeScore, false);
});

test("a structural blocker forces 'blocked' even with a perfect score (non-overridable rule)", () => {
  const result = scoreOpportunity({ ...perfectScores, blockers: ["blocker:no-authorization-path"] });
  assert.equal(result.weightedScore, 5);
  assert.equal(result.recommendation, "blocked");
  assert.equal(result.blockerOverrodeScore, true);
});

test("a mitigable blocker forces 'rework-required' even with a perfect score", () => {
  const result = scoreOpportunity({ ...perfectScores, blockers: ["blocker:unresolved-pii-exposure"] });
  assert.equal(result.recommendation, "rework-required");
  assert.equal(result.blockerOverrodeScore, true);
});

test("low scores with no blocker land in 'defer' band", () => {
  const low = Object.fromEntries(Object.keys(perfectScores).map((k) => [k, 1]));
  const result = scoreOpportunity({ ...low, blockers: [] });
  assert.equal(result.band, "defer");
  assert.equal(result.recommendation, "defer");
});

test("unknown blocker id throws rather than being silently ignored", () => {
  assert.throws(() => scoreOpportunity({ ...perfectScores, blockers: ["blocker:made-up"] }));
});

test("out-of-range dimension score throws", () => {
  assert.throws(() => scoreOpportunity({ ...perfectScores, businessValue: 9, blockers: [] }));
});

test("scoring is deterministic/reproducible for identical input", () => {
  const a = scoreOpportunity({ ...perfectScores, dataReadiness: 2, blockers: [] });
  const b = scoreOpportunity({ ...perfectScores, dataReadiness: 2, blockers: [] });
  assert.deepEqual(a, b);
});
