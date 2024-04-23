const { Pool } = require("pg");

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not configured");
}

const db = new Pool();

module.exports = db;
