const repo = require('../repositories/ventas.repository');
const librosClient = require('../clients/libros.client');

async function registrar({ libro_id, cantidad }) {
  if (!libro_id || !Number.isInteger(cantidad) || cantidad <= 0) {
    throw { status: 400, message: 'libro_id y cantidad (entero > 0) son obligatorios' };
  }

  // Descuenta primero: libros rechaza con 409 si no alcanzan las existencias
  const libro = await librosClient.ajustarExistencias(libro_id, -cantidad);
  try {
    return await repo.create({ libro_id, titulo: libro.titulo, cantidad });
  } catch (err) {
    // Si no se pudo guardar la venta, se devuelven las existencias
    await librosClient.ajustarExistencias(libro_id, cantidad).catch(() => {});
    throw err;
  }
}

async function listar() {
  return repo.findAll();
}

async function ranking(limite = 10) {
  const n = Math.min(Math.max(parseInt(limite) || 10, 1), 100);
  return repo.ranking(n);
}

module.exports = { registrar, listar, ranking };