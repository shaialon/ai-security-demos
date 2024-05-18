import { config, llmModels, LOGGER_OPTIONS } from "../../config.js";
import { getFromCache, setToCache } from "../utils/cache.js";

import { openAICompletion } from "./open_ai_utils.js";
import { anthropicCompletion } from "./anthropic_utils.js";
import { groqCompletion } from "./groq_utils.js";
import { logGrey } from "../utils/logger.js";

const LOG = config.VERBOSE_LOGGING;

const GROQ_MODELS = new Set([llmModels.MIXTRAL, llmModels.LLAMA2_70B, llmModels.LLAMA3_70B, llmModels.LLAMA3_8B]);

function identifyLLMProviderByModelName(modelName) {
  if (modelName.startsWith("gpt-")) {
    return "OpenAI";
  } else if (modelName.startsWith("claude-")) {
    return "Anthropic";
  } else if (GROQ_MODELS.has(modelName)) {
    return "Groq";
  }
  return null;
}

const RESOLVERS = {
  OpenAI: openAICompletion,
  Anthropic: anthropicCompletion,
  Groq: groqCompletion,
};

export async function llmCompletionWithCache(payload) {
  const payloadWithModel = Object.freeze({
    ...payload,
    model: payload.model || config.MODEL,
  });
  let chatCompletion = await getFromCache(payloadWithModel);
  if (!chatCompletion) {
    // Identify the LLM provider by the model name
    const llmProvider = identifyLLMProviderByModelName(payloadWithModel.model);
    LOG && console.log(`Making a request to ${llmProvider}: ${payloadWithModel.model}`);
    LOG && console.time("Query LLM Execution");

    // Choose the correct LLM provider
    chatCompletion = await RESOLVERS[llmProvider](payloadWithModel);

    LOG && console.timeEnd("Query LLM Execution");

    setToCache(payloadWithModel, chatCompletion);
  }

  LOG && console.log(`Response from LLM:`);
  LOG && logGrey(chatCompletion);

  return chatCompletion;
}
