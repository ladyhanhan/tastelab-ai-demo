import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import { aiSchemas } from "./ai-schemas.mjs";
import { buildPrompt } from "./ai-prompts.mjs";

function extractCitations(response) {
  const citations = [];
  const seen = new Set();
  for (const output of response.output || []) {
    if (output.type !== "message") continue;
    for (const content of output.content || []) {
      for (const annotation of content.annotations || []) {
        if (annotation.type !== "url_citation" || !annotation.url || seen.has(annotation.url)) continue;
        seen.add(annotation.url);
        citations.push({
          url: annotation.url,
          title: annotation.title || annotation.url
        });
      }
    }
  }
  return citations;
}

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

function normalizeLocalizationSources(data, citations) {
  if (!data?.variants) return data;
  const allowedUrls = new Set(citations.map((citation) => citation.url));
  return {
    ...data,
    variants: data.variants.map((variant) => ({
      ...variant,
      sourcedFacts: variant.sourcedFacts.map((fact) => ({
        ...fact,
        sourceUrl: allowedUrls.has(fact.sourceUrl) ? fact.sourceUrl : ""
      }))
    }))
  };
}

export async function runAiTask({
  apiKey,
  model,
  task,
  locale,
  payload,
  safetyIdentifier,
  signal
}) {
  const openai = new OpenAI({ apiKey });
  const prompt = buildPrompt(task, locale, payload);
  const schema = aiSchemas[task];
  const usesWebSearch = task === "localization_research";
  const reasoningEffort = ["robot_data_generate", "localization_research", "final_recipe_generate"].includes(task)
    ? "medium"
    : "low";
  const imageContent = task === "experiment_compare"
    ? (payload.photos || []).map((imageUrl) => ({
        type: "input_image",
        image_url: imageUrl,
        detail: "auto"
      }))
    : [];

  const response = await openai.responses.parse({
    model,
    store: false,
    safety_identifier: safetyIdentifier,
    reasoning: { effort: reasoningEffort },
    tools: usesWebSearch ? [{ type: "web_search", search_context_size: "medium" }] : undefined,
    input: [
      { role: "system", content: prompt.system },
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt.user },
          ...imageContent
        ]
      }
    ],
    text: {
      verbosity: "medium",
      format: zodTextFormat(schema, `tastelab_${task}`)
    }
  }, { signal });

  if (!response.output_parsed) {
    const error = new Error("The model did not return a valid structured result");
    error.code = "AI_INVALID_OUTPUT";
    throw error;
  }

  const citations = extractCitations(response);
  if (task === "translate_result") {
    let translated;
    try {
      translated = JSON.parse(response.output_parsed.translatedJson);
    } catch {
      const error = new Error("The translated result was not valid JSON");
      error.code = "AI_INVALID_OUTPUT";
      throw error;
    }
    if (!sameJsonShape(payload.data, translated)) {
      const error = new Error("The translated result changed the source data structure");
      error.code = "AI_INVALID_OUTPUT";
      throw error;
    }
    return { data: translated, citations: [] };
  }

  const data = task === "localization_research"
    ? normalizeLocalizationSources(response.output_parsed, citations)
    : response.output_parsed;
  const warnings = Array.isArray(data.warnings) ? data.warnings : [];
  return { data, citations, warnings };
}

