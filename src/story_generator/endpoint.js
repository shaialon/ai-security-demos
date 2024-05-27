import { logGreen, logRed, logYellow } from "../utils/logger.js";
import { generateStoryFromInputs } from "./story_generation.js";

export async function generateStory(storyData) {
  logYellow("🔎 Generating story with the following data: ", storyData);
  const story = await generateStoryFromInputs(storyData);
  return story;
}
