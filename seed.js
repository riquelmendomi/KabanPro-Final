const sequelize = require('./database');
const { usuario, tablero, lista, tarjeta } = require('./models');

async function seed() {
  try {
    console.log('iniciando seed...');

    await sequelize.sync({ force: true });
    console.log('tablas creadas');

    const user1 = await usuario.create({
      nombre: 'carlos',
      email: 'carlos@email.com'
    });

    const user2 = await usuario.create({
      nombre: 'ana',
      email: 'ana@email.com'
    });

    console.log('usuarios creados');

    const tablero1 = await tablero.create({
      nombre: 'proyecto kanbanpro',
      usuarioId: user1.id
    });

    const tablero2 = await tablero.create({
      nombre: 'tareas personales',
      usuarioId: user1.id
    });

    const tablero3 = await tablero.create({
      nombre: 'marketing',
      usuarioId: user2.id
    });

    console.log('tableros creados');

    const lista1 = await lista.create({
      nombre: 'pendientes',
      tableroId: tablero1.id
    });

    const lista2 = await lista.create({
      nombre: 'en progreso',
      tableroId: tablero1.id
    });

    console.log('listas creadas');

    await tarjeta.create({
        titulo: 'crear modelos sequelize',
        descripcion: 'definir usuario tablero lista tarjeta',
        listaId: lista1.id
      });
      
      await tarjeta.create({
        titulo: 'crear relaciones',
        descripcion: 'hasMany y belongsTo',
        listaId: lista2.id
      });

    console.log('datos de prueba creados correctamente');
  } catch (error) {
    console.error('error en seed:', error);
  } finally {
    await sequelize.close();
    console.log('conexion cerrada');
  }
}

seed();