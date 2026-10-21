const LIBROS_URL = process.env.LIBROS_URL || 'http://localhost:3001';

async function obtenerLibro(id) {
  const res = await fetch(`${LIBROS_URL}/libros/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw { status: 502, message: 'Servicio de libros no disponible' };
  return res.json();
}

module.exports = { obtenerLibro };