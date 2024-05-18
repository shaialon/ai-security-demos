import { config, llmModels, LOGGER_OPTIONS } from "../../config.js";
import OpenAI from "openai";

const openai = config.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    })
  : null;

const LOG = config.VERBOSE_LOGGING;

const OPENAI_DEFAULTS = {
  model: llmModels.GPT_4_TURBO,
  // response_format: { type: "json_object" },
  temperature: 0,
  seed: 100,
};
export async function openAICompletion(payload) {
  const chatCompletion = await openai.chat.completions.create({
    ...OPENAI_DEFAULTS,
    ...payload,
  });

  LOG && console.dir(chatCompletion.usage, LOGGER_OPTIONS);

  return chatCompletion.choices[0].message.content;
}
