const express = require('express');
const { addPublicidad, deletePublicidad, editPublicidad, getAllPublicidad } = require('../controllers/publicidadController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/add', authenticateJWT, addPublicidad);
router.delete('/delete/:id', authenticateJWT, deletePublicidad);
router.put('/edit/:id', authenticateJWT, editPublicidad);
router.get('/all', authenticateJWT, getAllPublicidad);

module.exports = router;