import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const llmModels = {
  // OpenAI
  GPT_3_5: "gpt-3.5-turbo-0125",
  GPT_4_TURBO: "gpt-4-turbo-preview",
  GPT_4: "gpt-4",
  GPT_4o: "gpt-4o",

  // Anthropic
  CLAUDE_3_HAIKU: "claude-3-haiku-20240307", // fastest
  CLAUDE_3_SONNET: "claude-3-sonnet-20240229", // Balanced
  CLAUDE_3_OPUS: "claude-3-opus-20240229", // Stronger

  // Groq
  LLAMA3_70B: "llama3-70b-8192",
  LLAMA3_8B: "llama3-8b-8192",
  MIXTRAL: "mixtral-8x7b-32768",
  LLAMA2_70B: "llama2-70b-4096",
};

const IS_TEST = process.env.JEST_WORKER_ID !== undefined;

export const config = Object.freeze({
  // API Keys
  OPENAI_API_KEY: process.env["OPENAI_API_KEY"],
  ANTHROPIC_API_KEY: process.env["ANTHROPIC_API_KEY"],
  GROQ_API_KEY: process.env["GROQ_API_KEY"],

  // Models
  // MODEL: llmModels.CLAUDE_3_OPUS,
  MODEL: llmModels.CLAUDE_3_SONNET,
  // MODEL: llmModels.CLAUDE_3_HAIKU,
  // MODEL: llmModels.GPT_4o,
  // MODEL: llmModels.LLAMA3_70B,
  // MODEL: llmModels.LLAMA3_8B,

  // Misc
  VERBOSE_LOGGING: true && !IS_TEST, // process.env["VERBOSE_LOGGING"] === "true",
  IS_TEST,
  PORT: process.env["PORT"] || 8010,
  __dirname,
});

export const LOGGER_OPTIONS = {
  depth: null,
  colors: true,
};
