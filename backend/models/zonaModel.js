const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Zona = sequelize.define('Zona', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tarifa1: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    tarifa2: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    tarifa3: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    tarifa4: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    stocktotal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    repartidores: {
      type: DataTypes.STRING,
      allowNull: true,
      // ESTA VALIDACION ES PARA INGRESAR HASTA 5 REPARTIDORES POR ZONA PERO SEPARADOS POR "," CAMBIAR DE SER NECESARIO
      validate: {
        is: /^(\d+)(,\d+){0,4}$/,
      },
    },
  }, {
    timestamps: false,
    tableName: 'Zonas',
  });

  return Zona;
};