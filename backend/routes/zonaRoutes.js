const express = require('express');
const { addZona, deleteZona, editZona, getAllZonas } = require('../controllers/zonaController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/add', authenticateJWT, addZona);
router.delete('/delete/:id', authenticateJWT, deleteZona);
router.put('/edit/:id', authenticateJWT, editZona);
router.get('/all', authenticateJWT, getAllZonas);

module.exports = router;