const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function init() {
  await pool.query('CREATE EXTENSION IF NOT EXISTS unaccent');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS libros (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(200) NOT NULL,
      autor VARCHAR(150) NOT NULL,
      precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
      existencias INT NOT NULL DEFAULT 0 CHECK (existencias >= 0)
    )
  `);
}

module.exports = { pool, init };