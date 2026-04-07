const usuario = require('./usuario');
const tablero = require('./tablero');
const lista = require('./lista');
const tarjeta = require('./tarjeta');

usuario.hasMany(tablero, { foreignKey: 'usuarioId', as: 'tableros' });
tablero.belongsTo(usuario, { foreignKey: 'usuarioId', as: 'usuario' });

tablero.hasMany(lista, { foreignKey: 'tableroId', as: 'listas' });
lista.belongsTo(tablero, { foreignKey: 'tableroId', as: 'tablero' });

lista.hasMany(tarjeta, { foreignKey: 'listaId', as: 'tarjetas' });
tarjeta.belongsTo(lista, { foreignKey: 'listaId', as: 'lista' });

module.exports = {
  usuario,
  tablero,
  lista,
  tarjeta
};