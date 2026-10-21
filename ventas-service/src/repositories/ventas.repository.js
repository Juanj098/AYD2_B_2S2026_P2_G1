const { pool } = require('../db');

async function create({ libro_id, titulo, cantidad }) {
  const { rows } = await pool.query(
    'INSERT INTO ventas (libro_id, titulo, cantidad) VALUES ($1,$2,$3) RETURNING *',
    [libro_id, titulo, cantidad]
  );
  return rows[0];
}

async function findAll() {
  const { rows } = await pool.query('SELECT * FROM ventas ORDER BY fecha DESC');
  return rows;
}

async function ranking(limite) {
  const { rows } = await pool.query(
    `SELECT libro_id, titulo, SUM(cantidad)::INT AS total_vendido
     FROM ventas
     GROUP BY libro_id, titulo
     ORDER BY total_vendido DESC
     LIMIT $1`,
    [limite]
  );
  return rows;
}

module.exports = { create, findAll, ranking };