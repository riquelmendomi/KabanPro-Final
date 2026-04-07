const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { nombre, correo, pass } = req.body;

    const existe = await Usuario.findOne({ where: { email: correo } });
    if (existe) {
      return res.status(400).send('El correo ya existe');
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    await Usuario.create({
      nombre,
      email: correo,
      password: hashedPassword
    });

    return res.redirect('/login');
  } catch (error) {
    console.error('ERROR REGISTRO:', error);
    return res.status(500).send('Error al registrar usuario');
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, pass } = req.body;

    const user = await Usuario.findOne({ where: { email: correo } });
    if (!user) {
      return res.status(401).send('Credenciales incorrectas');
    }

    const ok = await bcrypt.compare(pass, user.password);
    if (!ok) {
      return res.status(401).send('Credenciales incorrectas');
    }

    req.session.user = {
      id: user.id,
      nombre: user.nombre,
      email: user.email
    };

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('ERROR LOGIN:', error);
    return res.status(500).send('Error interno');
  }
};