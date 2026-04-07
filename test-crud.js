const sequelize = require('./database');
const { tablero, lista, tarjeta } = require('./models');

async function testCRUD() {
  try {
    console.log('iniciando test crud...');

    await sequelize.authenticate();
    console.log('conexion exitosa');

    // CREATE
    const listaExistente = await lista.findOne();

    if (!listaExistente) {
      console.log('no hay listas disponibles. ejecuta primero node seed.js');
      return;
    }

    const nuevaTarjeta = await tarjeta.create({
      titulo: 'tarjeta de prueba',
      descripcion: 'creada desde test-crud.js',
      listaId: listaExistente.id
    });

    console.log('CREATE OK:', nuevaTarjeta.toJSON());

    // READ
    const tableroConDatos = await tablero.findOne({
      include: {
        model: lista,
        include: tarjeta
      }
    });

    console.log('READ OK:');
    console.log(JSON.stringify(tableroConDatos, null, 2));

    // UPDATE
    nuevaTarjeta.titulo = 'tarjeta actualizada';
    await nuevaTarjeta.save();

    console.log('UPDATE OK:', nuevaTarjeta.toJSON());

    // DELETE
    await nuevaTarjeta.destroy();
    console.log('DELETE OK: tarjeta eliminada');

  } catch (error) {
    console.error('error en test crud:', error);
  } finally {
    await sequelize.close();
    console.log('conexion cerrada');
  }
}

testCRUD();