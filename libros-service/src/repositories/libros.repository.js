const { pool } = require('../db');

async function findAll({ titulo, autor, q }) {
  const where = [];
  const params = [];

  if (q) {
    params.push(`%${q}%`);
    where.push(`(unaccent(titulo) ILIKE unaccent($${params.length}) OR unaccent(autor) ILIKE unaccent($${params.length}))`);
  }
  if (titulo) {
    params.push(`%${titulo}%`);
    where.push(`unaccent(titulo) ILIKE unaccent($${params.length})`);
  }
  if (autor) {
    params.push(`%${autor}%`);
    where.push(`unaccent(autor) ILIKE unaccent($${params.length})`);
  }

  const sql = `SELECT * FROM libros ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY titulo`;
  const { rows } = await pool.query(sql, params);
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM libros WHERE id = $1', [id]);
  return rows[0];
}

async function create({ titulo, autor, precio, existencias }) {
  const { rows } = await pool.query(
    'INSERT INTO libros (titulo, autor, precio, existencias) VALUES ($1,$2,$3,$4) RETURNING *',
    [titulo, autor, precio, existencias]
  );
  return rows[0];
}

async function update(id, { titulo, autor, precio, existencias }) {
  const { rows } = await pool.query(
    `UPDATE libros SET titulo=$1, autor=$2, precio=$3, existencias=$4 WHERE id=$5 RETURNING *`,
    [titulo, autor, precio, existencias, id]
  );
  return rows[0];
}

module.exports = { findAll, findById, create, update };