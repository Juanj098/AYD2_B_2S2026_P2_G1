const repo = require('../repositories/ventas.repository');
const librosClient = require('../clients/libros.client');

async function registrar({ libro_id, cantidad }) {
  if (!libro_id || !cantidad || cantidad <= 0) {
    throw { status: 400, message: 'libro_id y cantidad (> 0) son obligatorios' };
  }
  const libro = await librosClient.obtenerLibro(libro_id);
  if (!libro) throw { status: 404, message: 'El libro no existe' };

  return repo.create({ libro_id, titulo: libro.titulo, cantidad });
}

async function listar() {
  return repo.findAll();
}

async function ranking(limite = 10) {
  const n = Math.min(Math.max(parseInt(limite) || 10, 1), 100);
  return repo.ranking(n);
}

module.exports = { registrar, listar, ranking };