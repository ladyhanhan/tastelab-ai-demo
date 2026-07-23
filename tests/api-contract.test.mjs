import assert from "node:assert/strict";
import test from "node:test";

import {
  AI_TASKS,
  MAX_AI_REQUEST_BYTES,
  createAiEnvelope,
  parseAiRequest
} from "../server/ai-contracts.mjs";
import {
  createSessionToken,
  readSessionToken
} from "../server/session-token.mjs";
import { LocalizationResearchSchema } from "../server/ai-schemas.mjs";

test("AI request contract accepts a supported task", () => {
  const request = parseAiRequest({
    task: "brief_analyze",
    locale: "zh-CN",
    projectId: "project-demo",
    payload: { form: { dishGoal: "川味鸡肉饭" } }
  });

  assert.equal(request.task, "brief_analyze");
  assert.equal(request.locale, "zh-CN");
  assert.deepEqual(AI_TASKS.includes(request.task), true);
});

test("AI request contract rejects unsupported tasks", () => {
  assert.throws(
    () => parseAiRequest({
      task: "invent_expert_feedback",
      locale: "zh-CN",
      projectId: "project-demo",
      payload: {}
    }),
    /Unsupported AI task/
  );
});

test("AI request contract rejects oversized text fields", () => {
  assert.throws(
    () => parseAiRequest({
      task: "brief_analyze",
      locale: "zh-CN",
      projectId: "project-demo",
      payload: { dishGoal: "x".repeat(20_001) }
    }),
    /text field is too long/
  );
});

test("AI response envelope includes provenance", () => {
  const envelope = createAiEnvelope({
    task: "brief_analyze",
    locale: "zh-CN",
    model: "gpt-5.6-terra",
    data: { recognizedFacts: [] }
  });

  assert.equal(envelope.task, "brief_analyze");
  assert.equal(envelope.model, "gpt-5.6-terra");
  assert.match(envelope.requestId, /^ai_/);
  assert.ok(Date.parse(envelope.generatedAt));
  assert.deepEqual(envelope.warnings, []);
  assert.deepEqual(envelope.citations, []);
});

test("session token round trips and rejects tampering", async () => {
  const secret = "test-session-secret-with-enough-length";
  const token = await createSessionToken({
    workspace: "Botinkit 深圳研发空间",
    expiresAt: Date.now() + 60_000
  }, secret);

  const session = await readSessionToken(token, secret);
  assert.equal(session.workspace, "Botinkit 深圳研发空间");

  const [payload, signature] = token.split(".");
  const tampered = `${payload}.${signature.startsWith("a") ? "b" : "a"}${signature.slice(1)}`;
  assert.equal(await readSessionToken(tampered, secret), null);
});

test("AI request payload limit stays below Vercel function limit", () => {
  assert.equal(MAX_AI_REQUEST_BYTES, 4_000_000);
  assert.ok(MAX_AI_REQUEST_BYTES < 4_500_000);
});

test("localization sourced facts require publication dates", () => {
  const result = LocalizationResearchSchema.safeParse({
    variants: [{
      market: "新加坡",
      summary: "示例市场结论",
      tasteAdjustments: [],
      ingredientSubstitutions: [],
      costAssumption: "待报价",
      executabilityImpact: "需要复测",
      sourcedFacts: [{
        claim: "示例来源事实",
        sourceUrl: "https://example.com/source"
      }],
      inferences: [],
      validationItems: []
    }],
    sharedCore: ["保留核心风味"],
    warnings: []
  });

  assert.equal(result.success, false);
});
