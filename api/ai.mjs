import {
  MAX_AI_REQUEST_BYTES,
  createAiEnvelope,
  parseAiRequest
} from "../server/ai-contracts.mjs";
import { runAiTask } from "../server/ai-service.mjs";
import { errorJson, requireSession } from "../server/http.mjs";

export const maxDuration = 90;

const recentCalls = new Map();

function validatePhotos(payload) {
  const photos = payload.photos;
  if (photos === undefined) return;
  if (!Array.isArray(photos) || photos.length > 3) {
    throw new TypeError("A maximum of three experiment photos is supported");
  }
  for (const photo of photos) {
    if (typeof photo !== "string" || !/^data:image\/(jpeg|png|webp);base64,/u.test(photo)) {
      throw new TypeError("Experiment photos must be JPEG, PNG, or WebP data URLs");
    }
  }
}

function throttle(sessionId, task) {
  const key = `${sessionId}:${task}`;
  const now = Date.now();
  const previous = recentCalls.get(key) || 0;
  recentCalls.set(key, now);
  return now - previous < 700;
}

function mapAiError(error, requestId) {
  if (error?.name === "AbortError") {
    return errorJson("AI_TIMEOUT", "The AI request timed out. Please retry.", 504, requestId);
  }
  if (error?.code === "AI_INVALID_OUTPUT") {
    return errorJson("AI_INVALID_OUTPUT", error.message, 422, requestId);
  }
  if (error?.status === 429) {
    return errorJson("AI_RATE_LIMITED", "The AI service is busy. Please retry shortly.", 429, requestId);
  }
  if (error?.status === 401) {
    return errorJson("AI_KEY_INVALID", "The configured AI provider key is invalid.", 503, requestId);
  }
  if (error?.status >= 500) {
    return errorJson("AI_UPSTREAM_ERROR", "The AI service is temporarily unavailable.", 503, requestId);
  }
  return errorJson("AI_REQUEST_FAILED", "The AI request could not be completed.", 500, requestId);
}

export async function POST(request) {
  const requestId = `req_${crypto.randomUUID()}`;
  const session = await requireSession(request, process.env.SESSION_SECRET);
  if (!session) {
    return errorJson("AUTH_REQUIRED", "Sign in to use TasteLab AI.", 401, requestId);
  }
  const provider = process.env.AI_PROVIDER || "moonshot";
  if (provider !== "moonshot") {
    return errorJson("AI_NOT_CONFIGURED", "The configured AI provider is not supported.", 503, requestId);
  }
  if (!process.env.MOONSHOT_API_KEY) {
    return errorJson("AI_NOT_CONFIGURED", "Kimi API access is not configured.", 503, requestId);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_AI_REQUEST_BYTES) {
    return errorJson("PAYLOAD_TOO_LARGE", "The AI request exceeds the 4 MB demo limit.", 413, requestId);
  }

  let body;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_AI_REQUEST_BYTES) {
      return errorJson("PAYLOAD_TOO_LARGE", "The AI request exceeds the 4 MB demo limit.", 413, requestId);
    }
    body = parseAiRequest(JSON.parse(raw));
    validatePhotos(body.payload);
  } catch (error) {
    return errorJson("INVALID_REQUEST", error.message || "Invalid AI request.", 400, requestId);
  }

  if (throttle(session.id, body.task)) {
    return errorJson("REQUEST_THROTTLED", "Please wait before repeating this AI action.", 429, requestId);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 85_000);
  try {
    const model = process.env.MOONSHOT_MODEL || "kimi-k3";
    const result = await runAiTask({
      apiKey: process.env.MOONSHOT_API_KEY,
      model,
      task: body.task,
      locale: body.locale,
      payload: body.payload,
      signal: controller.signal
    });
    return new Response(JSON.stringify(createAiEnvelope({
      task: body.task,
      locale: body.locale,
      model,
      data: result.data,
      warnings: result.warnings,
      citations: result.citations
    })), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  } catch (error) {
    console.error(JSON.stringify({
      requestId,
      task: body.task,
      status: error?.status || 500,
      code: error?.code || error?.name || "UNKNOWN"
    }));
    return mapAiError(error, requestId);
  } finally {
    clearTimeout(timeout);
  }
}
