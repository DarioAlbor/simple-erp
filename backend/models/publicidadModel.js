const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Publicidad = sequelize.define('Publicidad', {
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dia_semana: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']],
      },
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'publicidad',
  });

  return Publicidad;
};