import { z } from "zod";

const shortText = z.string().trim().min(1).max(240);
const paragraph = z.string().trim().min(1).max(1200);
const confidence = z.enum(["high", "medium", "low"]);
const severity = z.enum(["success", "warning", "danger"]);

export const BriefAnalysisSchema = z.object({
  nameSuggestions: z.array(shortText).max(3),
  recognizedFacts: z.array(z.object({
    label: shortText,
    value: shortText,
    evidence: paragraph,
    confidence
  })).max(12),
  sensoryKeywords: z.array(shortText).max(10),
  missingQuestions: z.array(paragraph).max(8),
  conflicts: z.array(z.object({
    id: z.string().trim().min(1).max(80),
    title: shortText,
    description: paragraph,
    sourceA: paragraph,
    sourceB: paragraph,
    resolutionOptions: z.array(z.object({
      id: z.string().trim().min(1).max(80),
      label: shortText,
      impact: paragraph
    })).min(2).max(4)
  })).max(8),
  warnings: z.array(paragraph).max(8)
});

export const RecipeStandardizationSchema = z.object({
  ingredients: z.array(z.object({
    name: shortText,
    amount: z.string().trim().max(80),
    preparation: z.string().trim().max(240),
    confidence
  })).max(30),
  stages: z.array(z.object({
    name: shortText,
    chefIntent: paragraph,
    estimatedTemperatureC: z.number().int().min(20).max(260).nullable(),
    estimatedDurationSeconds: z.number().int().min(0).max(1800).nullable(),
    motion: z.string().trim().max(240),
    additions: z.array(shortText).max(12),
    qualityCheckpoint: z.string().trim().max(400),
    assumptions: z.array(paragraph).max(6)
  })).min(1).max(15),
  unresolvedItems: z.array(paragraph).max(12),
  assumptions: z.array(paragraph).max(12)
});

export const RobotDataSchema = z.object({
  version: shortText,
  title: shortText,
  totalDurationSeconds: z.number().int().min(1).max(1800),
  batchRange: shortText,
  temperatureStages: z.array(z.object({
    startSecond: z.number().int().min(0).max(1800),
    endSecond: z.number().int().min(1).max(1800),
    temperatureC: z.number().int().min(40).max(260),
    label: shortText,
    intent: paragraph
  })).min(2).max(12),
  ingredientSchedule: z.array(z.object({
    atSecond: z.number().int().min(0).max(1800),
    ingredient: shortText,
    amount: shortText,
    purpose: paragraph
  })).min(1).max(30),
  wokActions: z.array(z.object({
    startSecond: z.number().int().min(0).max(1800),
    endSecond: z.number().int().min(1).max(1800),
    rpm: z.number().int().min(0).max(80),
    label: shortText,
    intent: paragraph
  })).min(1).max(15),
  parameterSummary: z.object({
    preheatTemperatureC: z.number().int().min(40).max(260),
    tossSpeedRpm: z.number().int().min(0).max(80),
    sauceTimingSecond: z.number().int().min(0).max(1800),
    batchSize: z.number().int().min(1).max(100)
  }),
  qualityGates: z.array(z.object({
    title: shortText,
    description: paragraph,
    severity
  })).min(2).max(12),
  risks: z.array(paragraph).max(12),
  assumptions: z.array(paragraph).min(1).max(12),
  basis: z.array(paragraph).min(1).max(12)
});

export const ExperimentComparisonSchema = z.object({
  recommendation: paragraph,
  comparedVersions: z.array(z.object({
    id: shortText,
    summary: paragraph,
    score: z.number().min(0).max(10).nullable()
  })).min(1).max(8),
  visualObservations: z.array(paragraph).max(12),
  tradeoffs: z.array(paragraph).max(12),
  nextExperiment: paragraph,
  limitations: z.array(paragraph).min(1).max(8)
});

export const LocalizationResearchSchema = z.object({
  variants: z.array(z.object({
    market: shortText,
    summary: paragraph,
    tasteAdjustments: z.array(paragraph).max(8),
    ingredientSubstitutions: z.array(paragraph).max(8),
    costAssumption: paragraph,
    executabilityImpact: paragraph,
    sourcedFacts: z.array(z.object({
      claim: paragraph,
      sourceUrl: z.string().url().or(z.literal("")),
      publicationDate: z.string().trim().min(1).max(80)
    })).max(8),
    inferences: z.array(paragraph).max(8),
    validationItems: z.array(paragraph).max(8)
  })).min(1).max(8),
  sharedCore: z.array(paragraph).min(1).max(8),
  warnings: z.array(paragraph).max(10)
});

export const FinalRecipeSchema = z.object({
  title: shortText,
  status: z.enum(["team_confirmed_draft"]),
  robotSummary: paragraph,
  experimentSummary: paragraph,
  marketSummary: paragraph,
  ingredients: z.array(z.object({
    name: shortText,
    amount: shortText,
    note: z.string().trim().max(300)
  })).max(30),
  steps: z.array(z.object({
    stage: shortText,
    temperatureC: z.number().int().min(20).max(260).nullable(),
    timeRange: shortText,
    action: paragraph
  })).min(1).max(20),
  qualityGates: z.array(paragraph).min(1).max(12),
  assumptions: z.array(paragraph).min(1).max(12),
  unresolvedWarnings: z.array(paragraph).max(12),
  auditTrail: z.array(paragraph).min(1).max(12)
});

export const TranslationSchema = z.object({
  translatedJson: z.string().min(2).max(80_000)
});

export const aiSchemas = Object.freeze({
  brief_analyze: BriefAnalysisSchema,
  recipe_standardize: RecipeStandardizationSchema,
  robot_data_generate: RobotDataSchema,
  experiment_compare: ExperimentComparisonSchema,
  localization_research: LocalizationResearchSchema,
  final_recipe_generate: FinalRecipeSchema,
  translate_result: TranslationSchema
});
