import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeLocalizationAsInference,
  parseStructuredResult
} from "../server/ai-service.mjs";

test("Kimi JSON output is validated against the task schema", () => {
  const result = parseStructuredResult("brief_analyze", JSON.stringify({
    nameSuggestions: [],
    recognizedFacts: [],
    sensoryKeywords: [],
    missingQuestions: [],
    conflicts: [],
    warnings: []
  }));

  assert.deepEqual(result.nameSuggestions, []);
  assert.throws(
    () => parseStructuredResult("brief_analyze", JSON.stringify({ nameSuggestions: [] })),
    /required data structure/
  );
});

test("localization output is forced into inference-only mode", () => {
  const result = normalizeLocalizationAsInference({
    variants: [{
      market: "新加坡",
      summary: "市场适配建议",
      tasteAdjustments: [],
      ingredientSubstitutions: [],
      costAssumption: "待验证",
      executabilityImpact: "需要复测",
      sourcedFacts: [{
        claim: "模型生成的未验证市场结论",
        sourceUrl: "https://example.com",
        publicationDate: "2026-01-01"
      }],
      inferences: ["已有推断"],
      validationItems: []
    }],
    sharedCore: ["核心风味"],
    warnings: []
  }, "zh-CN");

  assert.deepEqual(result.variants[0].sourcedFacts, []);
  assert.deepEqual(result.variants[0].inferences, [
    "已有推断",
    "模型生成的未验证市场结论"
  ]);
  assert.match(result.warnings[0], /未使用实时联网搜索/);
});
