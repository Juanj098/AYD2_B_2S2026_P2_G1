const repo = require('../repositories/libros.repository');

function validar({ titulo, autor, precio, existencias }) {
  if (!titulo || !autor) throw { status: 400, message: 'titulo y autor son obligatorios' };
  if (precio == null || precio < 0) throw { status: 400, message: 'precio inválido' };
  if (existencias == null || existencias < 0) throw { status: 400, message: 'existencias inválidas' };
}

async function listar(filtros) {
  return repo.findAll(filtros);
}

async function obtener(id) {
  const libro = await repo.findById(id);
  if (!libro) throw { status: 404, message: 'Libro no encontrado' };
  return libro;
}

async function crear(data) {
  validar(data);
  return repo.create(data);
}

async function actualizar(id, data) {
  validar(data);
  const libro = await repo.update(id, data);
  if (!libro) throw { status: 404, message: 'Libro no encontrado' };
  return libro;
}

async function ajustarExistencias(id, { delta }) {
  if (!Number.isInteger(delta) || delta === 0) {
    throw { status: 400, message: 'delta debe ser un entero distinto de 0' };
  }
  const libro = await repo.ajustarExistencias(id, delta);
  if (libro) return libro;

  const existente = await repo.findById(id);
  if (!existente) throw { status: 404, message: 'Libro no encontrado' };
  throw { status: 409, message: `Existencias insuficientes: solo hay ${existente.existencias}` };
}

module.exports = { listar, obtener, crear, actualizar, ajustarExistencias };