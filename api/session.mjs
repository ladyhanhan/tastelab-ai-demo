import { timingSafeEqual } from "node:crypto";

import { json, errorJson, readCookie, SESSION_COOKIE } from "../server/http.mjs";
import { createSessionToken, readSessionToken } from "../server/session-token.mjs";

const SESSION_SECONDS = 8 * 60 * 60;

function secureEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sessionCookie(request, value, maxAge) {
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function configurationReady() {
  return Boolean(
    process.env.DEMO_ACCESS_CODE
    && process.env.SESSION_SECRET
    && process.env.SESSION_SECRET.length >= 24
  );
}

export async function GET(request) {
  if (!configurationReady()) {
    return errorJson("AUTH_NOT_CONFIGURED", "Demo access is not configured.", 503);
  }
  const token = readCookie(request, SESSION_COOKIE);
  const session = await readSessionToken(token, process.env.SESSION_SECRET);
  return json({
    authenticated: Boolean(session),
    workspace: session?.workspace || null
  });
}

export async function POST(request) {
  if (!configurationReady()) {
    return errorJson("AUTH_NOT_CONFIGURED", "Demo access is not configured.", 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorJson("INVALID_JSON", "Login request must be valid JSON.", 400);
  }

  if (!secureEqual(body.accessCode, process.env.DEMO_ACCESS_CODE)) {
    return errorJson("INVALID_ACCESS_CODE", "The demo access code is incorrect.", 401);
  }

  const workspace = typeof body.workspace === "string" && body.workspace.trim()
    ? body.workspace.trim().slice(0, 120)
    : "Botinkit 深圳研发空间";
  const session = {
    id: crypto.randomUUID(),
    workspace,
    expiresAt: Date.now() + SESSION_SECONDS * 1000
  };
  const token = await createSessionToken(session, process.env.SESSION_SECRET);
  return json(
    { authenticated: true, workspace },
    200,
    { "set-cookie": sessionCookie(request, token, SESSION_SECONDS) }
  );
}

export function DELETE(request) {
  return json(
    { authenticated: false },
    200,
    { "set-cookie": sessionCookie(request, "", 0) }
  );
}
