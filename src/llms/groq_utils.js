import { config, llmModels, LOGGER_OPTIONS } from "../../config.js";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: config.GROQ_API_KEY || "MISSING_GROQ_API_KEY",
});

const LOG = config.VERBOSE_LOGGING;

const GROQ_DEFAULTS = {
  model: llmModels.MIXTRAL,
  // response_format: { type: "json_object" },
  temperature: 0,
  max_tokens: 1024,
  stream: false,
};
export async function groqCompletion(payload) {
  const chatCompletion = await groq.chat.completions.create({
    ...GROQ_DEFAULTS,
    ...payload,
  });

  LOG && console.dir(chatCompletion.usage, LOGGER_OPTIONS);

  return chatCompletion.choices[0].message.content;
}
