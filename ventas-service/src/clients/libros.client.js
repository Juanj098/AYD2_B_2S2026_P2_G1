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

async function ajustarExistencias(id, delta) {
  let res;
  try {
    res = await fetch(`${LIBROS_URL}/libros/${id}/existencias`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta }),
    });
  } catch (e) {
    throw { status: 502, message: 'No se pudo conectar con el servicio de libros' };
  }
  const data = await res.json().catch(() => ({}));
  if ([400, 404, 409].includes(res.status)) throw { status: res.status, message: data.error };
  if (!res.ok) throw { status: 502, message: 'Servicio de libros no disponible' };
  return data;
}

module.exports = { obtenerLibro, ajustarExistencias };