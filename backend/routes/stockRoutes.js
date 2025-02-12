const express = require('express');
const { addProduct, deleteProduct, editProduct, getAllProducts } = require('../controllers/stockController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/add', authenticateJWT, addProduct);
router.delete('/delete/:id', authenticateJWT, deleteProduct);
router.put('/edit/:id', authenticateJWT, editProduct);
router.get('/all', authenticateJWT, getAllProducts);

module.exports = router;