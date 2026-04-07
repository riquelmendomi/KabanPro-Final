const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const lista = sequelize.define('lista', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = lista;