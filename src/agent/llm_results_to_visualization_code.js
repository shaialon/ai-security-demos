import { llmCompletionWithCache } from "../llms/llm.js";
import { logGreen, logRed, logYellow } from "../utils/logger.js";

const SYSTEM_PROMPT_RESULTS_TO_VISUAL =
  `Your job: Take the results from the SQL query, and refine them for visualization.
Answer with the valid Nicely Formatted, Valid JS code - meant for running in Node.js 20.x and nothing else! Don't wrap with \`\`\`js - just the code I can run directly!
You will get from the user:
1. The requested user input.
2. A sample of the data they got from the system.

Your output will be Node.js code that will generate a visualization, based on the user's request and the data sample they provided.
Assume:
1. The code will run in a dedicated sandbox. You only need to provide one file.
2. The visualization will be done with the "billboard.js" library.
3. Your answer will alway start with these two lines :
import screenshot from "../screen.mjs";
import { DATA, sandbox_id } from "./data.js";
4. 'screenshot' is the utility function that will generate the image with a billboards.js chart config.
5. 'DATA' is the full data, from which the sample was taken. It's an array of objects.
6. 'sandbox_id' is a unique identifier for the sandbox. It's a string. It will be used to save the output image in the correct location: \`./sandbox/\${sandbox_id}/output.png\`,
7. If user does not specify visualization type, assume it's a horizontal bar chart.

Below is an example with the input, and output:
<example>
<input>
USER: Breakdown the top income by company. Visualize the data with horizontal bar charts.
DATA SAMPLE: 
[
  {
    customer_name: "Pied Piper",
    total_income: 1171769,
    currency: "USD",
  },
  {
    customer_name: "Gekko & Co.",
    total_income: 70585,
    currency: "EUR",
  },
  {
    customer_name: "Stark Industries",
    total_income: 32380,
    currency: "USD",
  },
  {
    customer_name: "Wayne Enterprises",
    total_income: 12143,
    currency: "USD",
  },
  // Continues 19 more items
];
</input>


<output>
import screenshot from "../screen.mjs";
import { DATA, sandbox_id } from "./data.js";

const transformDataForChartWithGroups = data => {
  // 1. Identify Unique Currencies
  const currencies = [...new Set(data.map(item => item.currency))];

  // 2. Map Customers to Indexes
  const customerIndexes = {};
  data.forEach((item, index) => {
    customerIndexes[item.customer_name] = index + 1; // Start from 1 to leave space for 'x'
  });

  // 3. Initialize Chart Data Structure
  const chartData = [
    ["x", ...Object.keys(customerIndexes)], // Header row with customer names
    ...currencies.map(currency => [currency, ...new Array(Object.keys(customerIndexes).length).fill(0)]),
  ];

  // 4. Populate Income Data
  data.forEach(item => {
    const currencyRow = chartData.find(row => row[0] === item.currency);
    if (currencyRow) {
      const customerIndex = customerIndexes[item.customer_name];
      currencyRow[customerIndex] = item.total_income;
    }
  });

  // Return the modified data structure along with the groups
  return {
    data: chartData,
    groups: currencies,
  };
};

const { data, groups } = transformDataForChartWithGroups(DATA);

await screenshot(
  {
    // This setup will make it a stacked horizontal bar chart
    data: {
      x: "x",
      columns: data,
      groups: [groups], // make it stacked
      type: "bar",
    },

    axis: {
      rotated: true, // This line rotates the chart to make it horizontal
      x: {
        type: "category",
      },
    },
    transition: {
      duration: 0,
    },
  },
  \`./sandbox/\${sandbox_id}/output.png\`,
);
</output>
</example>
`.trim();

function generateDataSample(data) {
  const sample = data.slice(0, 5);
  return JSON.stringify(sample, null, 2);
}

function generateUserMessage(userQ, data) {
  return `USER: ${userQ}
DATA SAMPLE:
${generateDataSample(data)}

Don't add any text beyond the code!`;
}

export async function convertSQLResultsToVisual(userQ, data) {
  const start = Date.now();
  const payload = {
    messages: [
      { role: "system", content: SYSTEM_PROMPT_RESULTS_TO_VISUAL },
      { role: "user", content: generateUserMessage(userQ, data) },
    ],
  };
  const visualCodeFromAI = await llmCompletionWithCache(payload);
  const duration = Date.now() - start;
  logGreen(`[Took ${duration.toLocaleString()} ms]`);
  return visualCodeFromAI;
}
