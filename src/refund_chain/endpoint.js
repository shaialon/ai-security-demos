import { logGreen, logRed, logYellow } from "../utils/logger.js";

import { userQueryToRefund } from "./llm_query_to_refund.js";

const mockRequest = {
  status: "Delivered, On Time",
  delivery: "20 Days ago",
  evidence: null,
};

export async function processUserRefundRequest(userQRaw, agentId) {
  const userQ = userQRaw.trim();
  logYellow("🔎 " + userQ);
  const userRequest = {
    query: userQ,
    ...mockRequest,
  };
  const refundDecision = await userQueryToRefund(userRequest);
  return refundDecision;
}
