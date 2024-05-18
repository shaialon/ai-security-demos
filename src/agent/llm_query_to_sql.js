import { llmCompletionWithCache } from "../llms/llm.js";
import { logGreen, logRed, logYellow } from "../utils/logger.js";

const SYSTEM_PROMPT_USER_TO_SQL =
  `You job: Create SQL queries for a database of Invoices, to match all the requirements of the user's question. The database has the following schema:
\`\`\`sql
TABLE invoices (
    id TEXT PRIMARY KEY,
    price REAL,
    currency TEXT CHECK(currency IN ('USD', 'EUR', 'GBP')),
    customer_name TEXT,
    time TEXT,
    seller_id TEXT
)
\`\`\`

Notes:
- THIS IS THE ONLY TABLE IN THE DATABASE. NO Need FOR JOINS.
- When you GROUP BY, you should add sensible sorting to the results.
- You should generally have sensible sorting to the results, even if the user did not ask for it explicitly.
- When you extract prices, you always need to add the currency as well. For example with you 'SUM(price)', you should also 'GROUP BY currency' in the same query.
- The SQL query you share will run as-is, so don't add dummy data!
- Some of the user requirements may not be able to acomplish with a single SQL request. It's ok - the SQL is extracting intermediate data. There is later a review on the query Results (from DB), and refinement in code for visualization, currency conversions, etc.
- Don't add logical pieces that you don't know for sure! For example, you don't know currency conversion rates, so you can't convert between currencies!

Answer with the valid Nicely Formatted, Valid SQL and nothing else! Don't wrap with \`\`\`sql  - just the SQL that I can run directly!!!!!
`.trim();

export async function convertUserQueryToSQL(userQ, agentId) {
  const start = Date.now();
  const agentIDText = agentId ? `\nScope the result to seller_id: ${agentId}\n` : "";
  if (agentIDText) {
    logRed(agentIDText);
  }
  const payload = {
    messages: [
      { role: "system", content: SYSTEM_PROMPT_USER_TO_SQL },
      { role: "user", content: agentIDText + userQ },
    ],
  };
  const sqlQueryFromAI = await llmCompletionWithCache(payload);
  const duration = Date.now() - start;
  logGreen(`[Took ${duration.toLocaleString()} ms]`);
  return sqlQueryFromAI;
}
