const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Compras = sequelize.define('Compras', {
    producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    zona: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'Compras',
  });

  return Compras;
};