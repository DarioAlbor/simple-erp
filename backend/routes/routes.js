const express = require('express');
const authRoutes = require('./authRoutes');
const dataRoutes = require('./changedataRoutes');
const stockRoutes = require('./stockRoutes');
const zonaRoutes = require('./zonaRoutes');
const comprasRoutes = require('./comprasRoutes');
const pedidosRoutes = require('./pedidosRoutes');
const publicidadRoutes = require('./publicidadRoutes');

const router = express.Router();

// TODAS LAS RUTAS SE INICIALIZAN ACÁ
router.use('/api/auth', authRoutes);
router.use('/api/change-data', dataRoutes);
router.use('/api/stock', stockRoutes);
router.use('/api/zona', zonaRoutes);
router.use('/api/compras', comprasRoutes);
router.use('/api/pedidos', pedidosRoutes);
router.use('/api/publicidad', publicidadRoutes);

module.exports = router;