import { llmCompletionWithCache } from "../llms/llm.js";
import { logGreen, logGrey, logRed, logYellow } from "../utils/logger.js";

const SYSTEM_PROMPT_GENERATE_STORY = `
You are a large language model specialized in generating compelling stories based on user inputs. Use the provided information to craft a story that aligns with the user's preferences and requirements.
Format the output in a structured and readable format, ensuring that all elements provided by the user are included in the story.
`;

const USER_PROMPT_GENERATE_STORY = `
- Content Type: "{contentType}"
- Style: "Shaan Puri"
- Emoji Use: "{emojiUse}"
- Audience: "{audience}"
- Purpose: "{purpose}"
- Primary Message: "{primaryMessage}"
- Key Points: "{keyPoints}"
- Length: "{length}"
- Visual Elements: "{visualElements}"
- Visual Description: "{visualDescription}"
- Emotion: "{emotion}"
- Voice: "{voice}"
- Structure: "{structure}"
- Call to Action (CTA): "{cta}"
- Examples: "{examples}"
- Keywords: "{keywords}"
- References: "{references}"
- Background Information: "{background}"
Generate a story that incorporates all the elements above. Make sure the story is engaging and suitable for the specified content type and audience.
Your output should be the complete story in plain text format.
`;

export async function generateStoryFromInputs(inputs) {
  const start = Date.now();

  // Create a formatted string with user inputs
  const userPrompt = USER_PROMPT_GENERATE_STORY.replace(/{contentType}/g, inputs.contentType)
    .replace(/{emojiUse}/g, inputs.emojiUse)
    .replace(/{audience}/g, inputs.audience)
    .replace(/{purpose}/g, inputs.purpose)
    .replace(/{primaryMessage}/g, inputs.primaryMessage)
    .replace(/{keyPoints}/g, inputs.keyPoints)
    .replace(/{length}/g, inputs.length)
    .replace(/{visualElements}/g, inputs.visualElements)
    .replace(/{visualDescription}/g, inputs.visualDescription)
    .replace(/{emotion}/g, inputs.emotion)
    .replace(/{voice}/g, inputs.voice)
    .replace(/{structure}/g, inputs.structure)
    .replace(/{cta}/g, inputs.cta)
    .replace(/{examples}/g, inputs.examples)
    .replace(/{keywords}/g, inputs.keywords)
    .replace(/{references}/g, inputs.references)
    .replace(/{background}/g, inputs.background);

  logGreen("LLM Query to Generate Story Prompt:");
  logGrey(userPrompt);

  const payload = {
    messages: [
      { role: "system", content: SYSTEM_PROMPT_GENERATE_STORY },
      { role: "user", content: userPrompt },
    ],
  };

  const story = await llmCompletionWithCache(payload);
  const duration = Date.now() - start;
  logGreen(`[Took ${duration.toLocaleString()} ms]`);

  return story;
}
