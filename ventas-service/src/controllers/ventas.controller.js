const service = require('../services/ventas.service');

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error interno' });
  }
};

module.exports = {
  registrar: handle(async (req, res) => res.status(201).json(await service.registrar(req.body))),
  listar: handle(async (req, res) => res.json(await service.listar())),
  ranking: handle(async (req, res) => res.json(await service.ranking(req.query.limite))),
};