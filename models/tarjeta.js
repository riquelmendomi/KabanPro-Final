const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const tarjeta = sequelize.define('tarjeta', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'todo'
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = tarjeta;