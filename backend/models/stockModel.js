const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Stock = sequelize.define('Stock', {
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    precio2: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    precio3: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: false,
    tableName: 'stock',
  });

  return Stock;
};