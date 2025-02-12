const express = require('express');
const { addPedido, editPedido, getPedidosByVendedor, getAllPedidos, deletePedido } = require('../controllers/pedidosController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/add', authenticateJWT, addPedido);
router.put('/edit/:id', authenticateJWT, editPedido);
router.get('/vendedor/:vendedorId', authenticateJWT, getPedidosByVendedor);
router.get('/all', authenticateJWT, getAllPedidos);
router.delete('/delete/:id', authenticateJWT, deletePedido);

module.exports = router;
