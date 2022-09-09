const jwt = require('jsonwebtoken');

const { SECRET_KEY = 'secret_key' } = process.env;

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
};

const checkToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = {
  generateToken,
  checkToken,
};