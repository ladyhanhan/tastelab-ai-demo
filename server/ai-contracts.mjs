export const AI_TASKS = Object.freeze([
  "brief_analyze",
  "recipe_standardize",
  "robot_data_generate",
  "experiment_compare",
  "localization_research",
  "final_recipe_generate",
  "translate_result"
]);

export const MAX_AI_REQUEST_BYTES = 4_000_000;
const supportedLocales = new Set(["zh-CN", "en"]);

function requirePlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return value;
}

function validatePayloadValue(value, depth = 0) {
  if (depth > 10) {
    throw new TypeError("Payload nesting is too deep");
  }
  if (typeof value === "string") {
    const isImage = value.startsWith("data:image/");
    if (!isImage && value.length > 20_000) {
      throw new TypeError("Payload text field is too long");
    }
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > 100) throw new TypeError("Payload array is too large");
    value.forEach((item) => validatePayloadValue(item, depth + 1));
    return;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length > 100) throw new TypeError("Payload object has too many fields");
    entries.forEach(([key, item]) => {
      if (key.length > 120) throw new TypeError("Payload field name is too long");
      validatePayloadValue(item, depth + 1);
    });
  }
}

export function parseAiRequest(value) {
  const input = requirePlainObject(value, "AI request");
  if (!AI_TASKS.includes(input.task)) {
    throw new TypeError("Unsupported AI task");
  }
  if (!supportedLocales.has(input.locale)) {
    throw new TypeError("Unsupported locale");
  }
  if (typeof input.projectId !== "string" || input.projectId.trim().length < 3 || input.projectId.length > 120) {
    throw new TypeError("Invalid projectId");
  }

  const payload = requirePlainObject(input.payload, "payload");
  validatePayloadValue(payload);

  return {
    task: input.task,
    locale: input.locale,
    projectId: input.projectId.trim(),
    payload
  };
}

export function createAiEnvelope({
  task,
  locale,
  model,
  data,
  warnings = [],
  citations = []
}) {
  return {
    requestId: `ai_${crypto.randomUUID()}`,
    task,
    locale,
    model,
    generatedAt: new Date().toISOString(),
    data,
    warnings,
    citations
  };
}
