// Import the sqlite3 module
import sqlite3 from "sqlite3";
import { logGreen, logRed, logYellow } from "../utils/logger.js";

// Open the database
const db = new sqlite3.Database("./.db/invoices.sqlite");

/**
 * Runs a SQL query and returns the results.
 * @param {string} sqlToRun - The SQL query string to execute.
 * @returns {Promise<Array<Object>>} - A promise that resolves with the query results.
 */
const runSQL = async sqlToRun => {
  return new Promise((resolve, reject) => {
    db.all(sqlToRun, [], (err, rows) => {
      if (err) {
        logRed("🤖 SQL Query FAILED: ");
        console.log(err);

        reject(err);
      } else {
        logGreen("🤖 SQL Query Results: ");
        console.log(rows);

        resolve(rows);
      }
    });
  });
};

// Ensure to export the runSQL function
export { runSQL };
