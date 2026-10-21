const router = require('express').Router();
const c = require('../controllers/libros.controller');

router.get('/', c.listar);        // GET /libros?q=&titulo=&autor=
router.get('/:id', c.obtener);
router.post('/', c.crear);
router.put('/:id', c.actualizar);

module.exports = router;