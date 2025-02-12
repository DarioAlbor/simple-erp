const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/dbConfig');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3001;

// SE ACEPTAN DE CUALQUIER ORIGEN, CONFIGURARLO EN CASO DE SER NECESARIO
app.use(cors());

// SE PARSEAN LOS JSON
app.use(express.json());

// SE INICIAN TODAS LAS RUTAS DE ./routes/routes.js
app.use('/', routes);

// SE VERIFICA E INICIA LA DB Y EL SV
sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });
