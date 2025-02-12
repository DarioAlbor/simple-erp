const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rank: {
      type: DataTypes.ENUM('client', 'admin', 'seller', 'dealer'),
      allowNull: false,
      defaultValue: 'client',
    },
    lastactivity: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    firstactivity: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    imageprofile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disabled: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: '0',
    },
    notifications: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: '1',
    },
  }, {
    timestamps: false,
    tableName: 'users',
  });

  return User;
};