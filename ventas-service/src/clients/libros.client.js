const LIBROS_URL = process.env.LIBROS_URL || 'http://localhost:3001';

async function obtenerLibro(id) {
  let res;
  try {
    res = await fetch(`${LIBROS_URL}/libros/${id}`);
  } catch (e) {
    throw { status: 502, message: 'No se pudo conectar con el servicio de libros' };
  }
  if (res.status === 404) return null;
  if (!res.ok) throw { status: 502, message: 'Servicio de libros no disponible' };
  return res.json();
}

module.exports = { obtenerLibro };