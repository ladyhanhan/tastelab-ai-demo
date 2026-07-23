const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes) {
  return Buffer.from(bytes)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

function fromBase64Url(value) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return new Uint8Array(Buffer.from(`${normalized}${padding}`, "base64"));
}

async function importSecret(secret) {
  if (typeof secret !== "string" || secret.length < 24) {
    throw new TypeError("SESSION_SECRET must be at least 24 characters");
  }
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(payload, secret) {
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await importSecret(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function readSessionToken(token, secret) {
  try {
    const [body, signature, extra] = String(token || "").split(".");
    if (!body || !signature || extra) return null;
    const key = await importSecret(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature),
      encoder.encode(body)
    );
    if (!valid) return null;
    const payload = JSON.parse(decoder.decode(fromBase64Url(body)));
    if (!payload.expiresAt || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

