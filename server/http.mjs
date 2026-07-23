import { readSessionToken } from "./session-token.mjs";

export const SESSION_COOKIE = "tastelab_demo_session";

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers
    }
  });
}

export function errorJson(code, message, status, requestId = null) {
  return json({ error: { code, message, requestId } }, status);
}

export function readCookie(request, name) {
  const cookie = request.headers.get("cookie") || "";
  for (const item of cookie.split(";")) {
    const [key, ...parts] = item.trim().split("=");
    if (key === name) return decodeURIComponent(parts.join("="));
  }
  return "";
}

export async function requireSession(request, secret) {
  if (!secret) return null;
  return readSessionToken(readCookie(request, SESSION_COOKIE), secret);
}

