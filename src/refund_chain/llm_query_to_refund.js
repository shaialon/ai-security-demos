import { llmCompletionWithCache } from "../llms/llm.js";
import { logGreen, logGrey, logRed, logYellow } from "../utils/logger.js";
import { searchRefundExamples } from "./rag_refund_examples.js";

const SYSTEM_PROMPT_QUERY_TO_REFUND = `You are a large language model acting as an automated decision-making system for a company selling Bluetooth headsets. You need to evaluate customer refund requests based on specific company policies. Below are the key refund conditions:

1. Refund is approved if the product was delivered late (within the past 5 days) and the product remains unopened.
2. Refund is approved if the shipping delivery is confirmed to be running late.
3. Refund is approved if there is evidence provided by the requester that the product is defective, regardless of delivery timing.

Based on the given customer query, product delivery status, delivery timing, and any provided evidence, decide whether to approve or reject the refund request. Your output should be in JSON format, containing the decision ("Approved" or "Rejected") and the reason for this decision.

Here are the details of a finctional customer query:
- Query: "I want a refund, the Bluetooth headset doesn't work properly!"
- Status: "Delivered, On Time"
- Delivery: "7 Days ago"
- Evidence: "Video showing the product malfunctioning"

Your task is to evaluate the information provided, apply the refund conditions, and generate a decision along with a reason. Please format your output as follows:
{
    "decision": "<Approved or Rejected>",
    "reason": "<Explain why the decision was made based on the refund conditions>"
}
Evaluate the query and produce your minified JSON output.`;

function userRequestToFormattedText(userRequest) {
  let ret = `
- Query: "${userRequest.query}"
- Status: "${userRequest.status}"
- Delivery: "${userRequest.delivery}"
- Evidence: "${userRequest.evidence || "-"}"
`;
  return ret;
}

function formatExamples(examples) {
  const examplesTexts = examples
    .map(e => {
      return `REQUEST: ${userRequestToFormattedText(e)}\nRESPONSE:\n{ "decision": "${e.decision}", "reason": "${
        e.reason
      }" }`;
    })
    .join("\n\n");
  return `\n\nHere are some examples of refund requests and their outcomes:\n` + examplesTexts;
}

export async function userQueryToRefund(userQ) {
  const start = Date.now();
  // Step 1: Enrich this data with the mock request (DB simulation)
  const userPrompt = userRequestToFormattedText(userQ);

  // Step 2: Refund Requests RAG - Get the closest examples
  const similarExamples = searchRefundExamples(userQ);

  // Step 3: Query the LLM to get the refund decision + reason
  const systemPrompt = SYSTEM_PROMPT_QUERY_TO_REFUND + formatExamples(similarExamples);
  logGreen(`LLM Query to Refund System Prompt:`);
  logGrey(systemPrompt);
  logGreen(`LLM Query to Refund User Prompt:`);
  logGrey(userPrompt);
  const payload = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  };
  const refundDecision = await llmCompletionWithCache(payload);
  const duration = Date.now() - start;
  logGreen(`[Took ${duration.toLocaleString()} ms]`);
  return JSON.parse(refundDecision);
}
