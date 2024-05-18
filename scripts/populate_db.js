import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";
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
        console.log("Invoices table has been created successfully.");

        populateTable();
        // Only close the database connection after the table has been created

        setTimeout(() => {
          console.log("Closing the database connection.");
          db.close();
        }, 2000);
      }
    },
  );
});

const customersSeed = [
  { company: "Acme Corporation", seller_id: "Shai Alon", base_price: 1450, currency: "USD" },
  { company: "Globex Inc.", seller_id: "Shai Alon", base_price: 100, currency: "USD" },
  { company: "Soylent Corp.", seller_id: "Shai Alon", base_price: 340, currency: "USD" },
  { company: "Initech LLC", seller_id: "Erlich Bachman", base_price: 340, currency: "USD" },
  { company: "Vandelay Industries", seller_id: "Shai Alon", base_price: 2200, currency: "USD" },
  { company: "Bluth Company", seller_id: "Shai Alon", base_price: 900, currency: "USD" },
  { company: "Stark Industries", seller_id: "Richard Hendricks", base_price: 900, currency: "USD" },
  { company: "Wayne Enterprises", seller_id: "Richard Hendricks", base_price: 340, currency: "USD" },
  { company: "Dunder Mifflin", seller_id: "Erlich Bachman", base_price: 100, currency: "USD" },
  { company: "Pied Piper", seller_id: "Richard Hendricks", base_price: 3200, currency: "USD" },
  { company: "Gekko & Co.", seller_id: "Richard Hendricks", base_price: 1800, currency: "EUR" },
  { company: "Umbrella Corporation", seller_id: "Richard Hendricks", base_price: 850, currency: "EUR" },
  { company: "Vehement Capital Partners", seller_id: "Shai Alon", base_price: 850, currency: "EUR" },
  { company: "Massive Dynamic", seller_id: "Shai Alon", base_price: 85, currency: "EUR" },
  { company: "Cyberdyne Systems", seller_id: "Shai Alon", base_price: 100, currency: "EUR" },
  { company: "Cyberdyne Systems", seller_id: "Richard Hendricks", base_price: 100, currency: "USD" },
  { company: "Cyberdyne Systems", seller_id: "Erlich Bachman", base_price: 100, currency: "GBP" },
  { company: "Tyrell Corporation", seller_id: "Gilfoyle", base_price: 1800, currency: "GBP" },
  { company: "Weyland-Yutani", seller_id: "Shai Alon", base_price: 100, currency: "GBP" },
  { company: "Nakatomi Trading Corp.", seller_id: "Shai Alon", base_price: 50, currency: "GBP" },
  { company: "Virtucon Industries", seller_id: "Richard Hendricks", base_price: 50, currency: "GBP" },
  { company: "Oscorp Technologies", seller_id: "Shai Alon", base_price: 100, currency: "GBP" },
  { company: "Aviato", seller_id: "Erlich Bachman", base_price: 4800, currency: "GBP" },
  { company: "Hooli", seller_id: "Richard Hendricks", base_price: 4800, currency: "GBP" },
  { company: "Stoic Capital", seller_id: "Shai Alon", base_price: 1800, currency: "GBP" },
  { company: "Stoic Capital", seller_id: "Gilfoyle", base_price: 3800, currency: "USD" },
];

// Helper function to generate a random price within a range
const getRandomPrice = base_price => (Math.random() * base_price + base_price).toFixed(0);

// Helper function to generate a random date within the last year
const getRandomDate = () => {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
};

// Function to insert a record into the database
const insertRecord = customer => {
  const { base_price, currency, company, seller_id } = customer;
  if (!currency || !company || !seller_id || !base_price) {
    throw new Error("Missing required fields in customer object");
  }
  const id = uuidv4();
  const price = getRandomPrice(base_price);
  const time = getRandomDate();

  const sql = `INSERT INTO invoices (id, price, currency, customer_name, time, seller_id) VALUES (?, ?, ?, ?, ?, ?)`;
  const record = [id, price, currency, company, time, seller_id];
  db.run(sql, record, err => {
    if (err) {
      return console.error(err.message);
    }
    console.dir(record, { depth: null });
  });
};

// Main function to populate the table
const populateTable = () => {
  customersSeed.forEach(customer => {
    // repeat 12 times for each customer
    for (let i = 0; i < 12; i++) {
      insertRecord(customer);
    }
  });
};
