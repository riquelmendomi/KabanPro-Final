const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const tablero = sequelize.define('tablero', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = tablero;