import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./.db/invoices.sqlite");

db.serialize(function () {
  // Create the "invoices" table with the specified schema
  db.run(
    `CREATE TABLE IF NOT EXISTS invoices (
id TEXT PRIMARY KEY,
price REAL,
currency TEXT CHECK(currency IN ('USD', 'EUR', 'GBP')),
customer_name TEXT,
time TEXT,
seller_id TEXT
)`,
    [],
    function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Invoices table has been removed successfully.");

        setTimeout(() => {
          console.log("Closing the database connection.");
          db.close();
        }, 1000);
      }
    },
  );
});
