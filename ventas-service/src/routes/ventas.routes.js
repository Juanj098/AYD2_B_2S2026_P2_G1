const router = require('express').Router();
const c = require('../controllers/ventas.controller');

router.get('/ranking', c.ranking);  // va antes de cualquier ruta con :id
router.get('/', c.listar);
router.post('/', c.registrar);

module.exports = router;