const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
    producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precioVenta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referencia: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    vendedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Entregado', 'Reprogramado', 'Cancelado', 'Pagado', 'Nuevo'),
      allowNull: false,
      defaultValue: 'Nuevo',
    },
    entrega: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tarifa: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    repartidor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: true,
    tableName: 'pedidos',
  });

  return Pedido;
};