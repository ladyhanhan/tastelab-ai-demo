import assert from "node:assert/strict";
import test from "node:test";

import { GET as getSession, POST as createSession } from "../api/session.mjs";
import { POST as runAi } from "../api/ai.mjs";

const ORIGINAL_ENV = {
  DEMO_ACCESS_CODE: process.env.DEMO_ACCESS_CODE,
  SESSION_SECRET: process.env.SESSION_SECRET,
  AI_PROVIDER: process.env.AI_PROVIDER,
  MOONSHOT_API_KEY: process.env.MOONSHOT_API_KEY
};

function restoreEnvironment() {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

test.afterEach(restoreEnvironment);

test("session endpoint reports missing configuration", async () => {
  delete process.env.DEMO_ACCESS_CODE;
  delete process.env.SESSION_SECRET;

  const response = await getSession(new Request("https://demo.example/api/session"));
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.error.code, "AUTH_NOT_CONFIGURED");
});

test("session endpoint rejects an undersized session secret", async () => {
  process.env.DEMO_ACCESS_CODE = "correct-code";
  process.env.SESSION_SECRET = "too-short";

  const response = await getSession(new Request("https://demo.example/api/session"));

  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, "AUTH_NOT_CONFIGURED");
});

test("session endpoint rejects an incorrect access code", async () => {
  process.env.DEMO_ACCESS_CODE = "correct-code";
  process.env.SESSION_SECRET = "a-long-demo-session-secret";

  const response = await createSession(new Request("https://demo.example/api/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ accessCode: "wrong-code" })
  }));

  assert.equal(response.status, 401);
  assert.equal((await response.json()).error.code, "INVALID_ACCESS_CODE");
});

test("a valid session cookie authenticates a later request", async () => {
  process.env.DEMO_ACCESS_CODE = "correct-code";
  process.env.SESSION_SECRET = "a-long-demo-session-secret";

  const loginResponse = await createSession(new Request("https://demo.example/api/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      accessCode: "correct-code",
      workspace: "Botinkit 深圳研发空间"
    })
  }));
  const cookie = loginResponse.headers.get("set-cookie").split(";")[0];
  const statusResponse = await getSession(new Request("https://demo.example/api/session", {
    headers: { cookie }
  }));
  const status = await statusResponse.json();

  assert.equal(loginResponse.status, 200);
  assert.equal(statusResponse.status, 200);
  assert.equal(status.authenticated, true);
  assert.equal(status.workspace, "Botinkit 深圳研发空间");
});

test("AI endpoint requires an authenticated session", async () => {
  process.env.SESSION_SECRET = "a-long-demo-session-secret";
  process.env.MOONSHOT_API_KEY = "test-key";

  const response = await runAi(new Request("https://demo.example/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      task: "brief_analyze",
      locale: "zh-CN",
      projectId: "project-1",
      payload: {}
    })
  }));

  assert.equal(response.status, 401);
  assert.equal((await response.json()).error.code, "AUTH_REQUIRED");
});

test("AI endpoint reports a missing Kimi key after authentication", async () => {
  process.env.DEMO_ACCESS_CODE = "correct-code";
  process.env.SESSION_SECRET = "a-long-demo-session-secret";
  process.env.AI_PROVIDER = "moonshot";
  delete process.env.MOONSHOT_API_KEY;

  const loginResponse = await createSession(new Request("https://demo.example/api/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ accessCode: "correct-code" })
  }));
  const cookie = loginResponse.headers.get("set-cookie").split(";")[0];
  const response = await runAi(new Request("https://demo.example/api/ai", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie
    },
    body: JSON.stringify({
      task: "brief_analyze",
      locale: "zh-CN",
      projectId: "project-1",
      payload: {}
    })
  }));

  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, "AI_NOT_CONFIGURED");
});
