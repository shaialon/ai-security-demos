import { config, llmModels, LOGGER_OPTIONS } from "../../config.js";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: config.ANTHROPIC_API_KEY,
});

const LOG = config.VERBOSE_LOGGING;

const ANTHROPIC_DEFAULTS = {
  model: llmModels.CLAUDE_3_SONNET,
  // response_format: { type: "json_object" },
  temperature: 0,
  max_tokens: 4096,
};

function convertOpenAIPayloadToAnthropic(payload) {
  // if the first message is a system message, remove it from the messages array, and add it as a key "system" in the payload
  // This needs to be done without mutating the original payload, or it's children messages array
  const newPayload = { ...ANTHROPIC_DEFAULTS, ...payload };
  if (newPayload.messages[0].role === "system") {
    newPayload.system = newPayload.messages[0].content;
    newPayload.messages = newPayload.messages.slice(1);
  }
  return newPayload;
}

export async function anthropicCompletion(payload) {
  const anthropicPayload = convertOpenAIPayloadToAnthropic(payload);
  const chatCompletion = await anthropic.messages.create(anthropicPayload);

  LOG && console.dir(chatCompletion.usage, LOGGER_OPTIONS);

  return chatCompletion.content[0].text;
}
