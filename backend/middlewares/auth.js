const UnauthorizedError = require('../errors/UnauthorizedError');
const { checkToken } = require('./jwt');

const onAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  let payload;
  const token = auth.replace('Bearer ', '');
  try {
    payload = checkToken(token);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = { onAuth };