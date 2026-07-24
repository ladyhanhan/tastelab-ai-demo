import OpenAI from "openai";
import { z } from "zod";

import { aiSchemas } from "./ai-schemas.mjs";
import { buildPrompt } from "./ai-prompts.mjs";

const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";

function sameJsonShape(source, translated) {
  if (source === null || translated === null) return source === translated;
  if (Array.isArray(source)) {
    return Array.isArray(translated)
      && source.length === translated.length
      && source.every((item, index) => sameJsonShape(item, translated[index]));
  }
  if (typeof source === "object") {
    if (!translated || typeof translated !== "object" || Array.isArray(translated)) return false;
    const sourceKeys = Object.keys(source).sort();
    const translatedKeys = Object.keys(translated).sort();
    return sourceKeys.length === translatedKeys.length
      && sourceKeys.every((key, index) => key === translatedKeys[index] && sameJsonShape(source[key], translated[key]));
  }
  if (typeof source === "string") return typeof translated === "string";
  return source === translated;
}

export function normalizeLocalizationAsInference(data, locale) {
  if (!data?.variants) return data;
  const notice = locale === "zh-CN"
    ? "本地化建议未使用实时联网搜索，全部市场结论均为 AI 推断，必须由当地团队人工验证。"
    : "Localization did not use live web search. All market conclusions are AI inferences and require validation by local teams.";
  return {
    ...data,
    variants: data.variants.map((variant) => ({
      ...variant,
      sourcedFacts: [],
      inferences: [
        ...new Set([
          ...variant.inferences,
          ...variant.sourcedFacts.map((fact) => fact.claim)
        ])
      ]
    })),
    warnings: [...new Set([notice, ...(data.warnings || [])])]
  };
}

function structuredSystemPrompt(prompt, schema) {
  const jsonSchema = z.toJSONSchema(schema);
  delete jsonSchema.$schema;
  return `${prompt.system}

Return one valid JSON object only. Do not wrap it in Markdown or add explanatory text.
The JSON object must conform exactly to this schema:
${JSON.stringify(jsonSchema)}`;
}

function userContent(task, prompt, payload) {
  if (task !== "experiment_compare" || !(payload.photos || []).length) {
    return prompt.user;
  }
  return [
    { type: "text", text: prompt.user },
    ...(payload.photos || []).map((imageUrl) => ({
      type: "image_url",
      image_url: { url: imageUrl }
    }))
  ];
}

function invalidOutput(message) {
  const error = new Error(message);
  error.code = "AI_INVALID_OUTPUT";
  return error;
}

export function parseStructuredResult(task, content) {
  let value;
  try {
    value = JSON.parse(content);
  } catch {
    throw invalidOutput("The model did not return valid JSON");
  }
  const result = aiSchemas[task].safeParse(value);
  if (!result.success) {
    throw invalidOutput("The model result did not match the required data structure");
  }
  return result.data;
}

export async function runAiTask({
  apiKey,
  model,
  task,
  locale,
  payload,
  signal
}) {
  const moonshot = new OpenAI({
    apiKey,
    baseURL: MOONSHOT_BASE_URL
  });
  const prompt = buildPrompt(task, locale, payload);
  const response = await moonshot.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: structuredSystemPrompt(prompt, aiSchemas[task])
      },
      {
        role: "user",
        content: userContent(task, prompt, payload)
      }
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 16_000
  }, { signal });

  const content = response.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw invalidOutput("The model returned an empty result");
  }
  const parsed = parseStructuredResult(task, content);

  if (task === "translate_result") {
    let translated;
    try {
      translated = JSON.parse(parsed.translatedJson);
    } catch {
      throw invalidOutput("The translated result was not valid JSON");
    }
    if (!sameJsonShape(payload.data, translated)) {
      throw invalidOutput("The translated result changed the source data structure");
    }
    return { data: translated, citations: [], warnings: [] };
  }

  const data = task === "localization_research"
    ? normalizeLocalizationAsInference(parsed, locale)
    : parsed;
  const warnings = Array.isArray(data.warnings) ? data.warnings : [];
  return { data, citations: [], warnings };
}
