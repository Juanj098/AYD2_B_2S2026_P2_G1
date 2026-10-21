const service = require('../services/libros.service');

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error interno' });
  }
};

module.exports = {
  listar: handle(async (req, res) => res.json(await service.listar(req.query))),
  obtener: handle(async (req, res) => res.json(await service.obtener(req.params.id))),
  crear: handle(async (req, res) => res.status(201).json(await service.crear(req.body))),
  actualizar: handle(async (req, res) => res.json(await service.actualizar(req.params.id, req.body))),
};