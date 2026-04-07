// authMiddleware.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'kanbanpro_secret_2024';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No hay token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;  // Almacena el usuario decodificado en `req.user`
    next();  // Continuar con la solicitud
  } catch (error) {
    res.clearCookie('token');
    return res.status(401).json({ error: 'Token no válido o expirado' });
  }
};

module.exports = authMiddleware;