require('dotenv').config({ path: './config/.env' });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
  }
);

const User = require('../models/userModel')(sequelize);
const Stock = require('../models/stockModel')(sequelize);
const Zona = require('../models/zonaModel')(sequelize);
const Compras = require('../models/comprasModel')(sequelize);
const Pedidos = require('../models/pedidosModel')(sequelize);
const Publicidad = require('../models/publicidadModel')(sequelize);

module.exports = { sequelize, User, Stock, Zona, Compras, Pedidos, Publicidad };