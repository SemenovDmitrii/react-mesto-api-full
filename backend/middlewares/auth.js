const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация.');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV !== 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError('Ошибка токена. Необходима повторная авторизация.');
  }
  req.user = payload;
  next();
};
