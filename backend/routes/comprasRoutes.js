const express = require('express');
const { addCompra, deleteCompra, editCompra, getAllCompras } = require('../controllers/comprasController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/add', authenticateJWT, addCompra);
router.delete('/delete/:id', authenticateJWT, deleteCompra);
router.put('/edit/:id', authenticateJWT, editCompra);
router.get('/all', authenticateJWT, getAllCompras);

module.exports = router;