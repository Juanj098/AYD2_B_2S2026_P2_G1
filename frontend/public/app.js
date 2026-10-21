const API = '/api';
const $ = (sel) => document.querySelector(sel);
const COLORES = ['plum', 'rosewood', 'sage', 'lavender'];

let libroSeleccionado = null;

// Evita que texto de la base se interprete como HTML
function esc(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

const quetzales = (n) => `Q ${Number(n).toFixed(2)}`;

async function api(ruta, opciones = {}) {
  const res = await fetch(API + ruta, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

/* ---------- Catálogo ---------- */

async function cargarLibros() {
  const filtro = $('#filtro').value;
  const texto = $('#busqueda').value.trim();
  const params = texto ? `?${filtro}=${encodeURIComponent(texto)}` : '';
  const estado = $('#estado-catalogo');

  estado.textContent = 'Cargando catálogo…';
  try {
    const libros = await api('/libros' + params);
    renderLibros(libros);
    if (libros.length === 0) {
      estado.textContent = texto ? `No hay libros que coincidan con “${texto}”.` : 'El catálogo está vacío.';
    } else {
      estado.textContent = texto ? `${libros.length} resultado(s) para “${texto}”` : `${libros.length} libros en catálogo`;
    }
  } catch (e) {
    $('#grid-libros').innerHTML = '';
    estado.textContent = `No se pudo cargar el catálogo: ${e.message}`;
  }
}

function renderLibros(libros) {
  $('#grid-libros').innerHTML = libros.map((l) => `
    <article class="libro">
      <div class="portada portada-${COLORES[l.id % COLORES.length]}" aria-hidden="true">
        <span class="portada-titulo">${esc(l.titulo)}</span>
        <span class="portada-autor">${esc(l.autor)}</span>
      </div>
      <h3>${esc(l.titulo)}</h3>
      <p class="autor">${esc(l.autor)}</p>
      <div class="libro-pie">
        <span class="precio">${quetzales(l.precio)}</span>
        <span class="chip ${l.existencias > 0 ? '' : 'chip-agotado'}">
          ${l.existencias > 0 ? `${l.existencias} disponibles` : 'Agotado'}
        </span>
      </div>
      <button class="btn btn-borde btn-chico" data-vender="${l.id}" data-titulo="${esc(l.titulo)}">
        Registrar venta
      </button>
    </article>
  `).join('');
}

/* ---------- Ranking ---------- */

async function cargarRanking() {
  const lista = $('#lista-ranking');
  try {
    const ranking = await api('/ventas/ranking?limite=5');
    lista.innerHTML = ranking.length
      ? ranking.map((r, i) => `
          <li>
            <span class="pos">${i + 1}</span>
            <div>
              <strong>${esc(r.titulo)}</strong>
              <span class="total">${r.total_vendido} vendidos</span>
            </div>
          </li>`).join('')
      : '<li class="vacio">Aún no hay ventas registradas.</li>';
  } catch (e) {
    lista.innerHTML = '<li class="vacio">No se pudo cargar el ranking.</li>';
  }
}

/* ---------- Búsqueda ---------- */

let temporizador;
$('#busqueda').addEventListener('input', () => {
  clearTimeout(temporizador);
  temporizador = setTimeout(cargarLibros, 300);
});
$('#filtro').addEventListener('change', cargarLibros);
$('#form-busqueda').addEventListener('submit', (e) => {
  e.preventDefault();
  cargarLibros();
});

/* ---------- Registrar venta ---------- */

$('#grid-libros').addEventListener('click', (e) => {
  const boton = e.target.closest('[data-vender]');
  if (!boton) return;
  libroSeleccionado = Number(boton.dataset.vender);
  $('#venta-libro').textContent = boton.dataset.titulo;
  $('#venta-cantidad').value = 1;
  $('#venta-error').textContent = '';
  $('#dlg-venta').showModal();
});

$('#form-venta').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/ventas', {
      method: 'POST',
      body: JSON.stringify({ libro_id: libroSeleccionado, cantidad: Number($('#venta-cantidad').value) }),
    });
    $('#dlg-venta').close();
    cargarRanking();
  } catch (err) {
    $('#venta-error').textContent = err.message;
  }
});

/* ---------- Agregar libro ---------- */

$('#btn-nuevo').addEventListener('click', () => {
  $('#form-libro').reset();
  $('#libro-error').textContent = '';
  $('#dlg-libro').showModal();
});

$('#form-libro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  try {
    await api('/libros', {
      method: 'POST',
      body: JSON.stringify({
        titulo: datos.titulo.trim(),
        autor: datos.autor.trim(),
        precio: Number(datos.precio),
        existencias: Number(datos.existencias),
      }),
    });
    $('#dlg-libro').close();
    cargarLibros();
  } catch (err) {
    $('#libro-error').textContent = err.message;
  }
});

/* ---------- Cerrar diálogos ---------- */

document.querySelectorAll('[data-cerrar]').forEach((b) =>
  b.addEventListener('click', () => b.closest('dialog').close())
);

/* ---------- Inicio ---------- */

cargarLibros();
cargarRanking();