import { logGreen, logRed, logYellow } from "../utils/logger.js";

import { convertUserQueryToSQL } from "./llm_query_to_sql.js";
import { runSQL } from "./invoices_sql_db.js";
import { convertSQLResultsToVisual } from "./llm_results_to_visualization_code.js";
import { createSandboxAndRun } from "./visualization_sandbox.js";

export async function processUserQuery(userQRaw, agentId) {
  const userQ = userQRaw.trim();
  logYellow("🔎 " + userQ);
  // Step 1: LLM: Convert user query to SQL
  const sqlQueryFromAI = await convertUserQueryToSQL(userQ, agentId);

  try {
    // Step 2: Run SQL query
    const results = await runSQL(sqlQueryFromAI);

    // Step 3: LLM: Get Node.js code to visual results from SQL.
    const visualCodeFromAI = await convertSQLResultsToVisual(userQ, results);

    // Step 4: Run the visualization code
    const output_image = await createSandboxAndRun({
      data: results,
      js_code: visualCodeFromAI,
    });

    // Return the SQL results, and the output image
    return { results, output_image };
  } catch (err) {
    console.error("Error running SQL query:", err);
  }
}
