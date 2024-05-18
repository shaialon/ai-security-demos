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
  `./sandbox/${sandbox_id}/output.png`,
);
