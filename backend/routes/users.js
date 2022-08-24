const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');

const {
  getUser,
  getUsers,
  createUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routerUsers.get('/', getUsers);

routerUsers.get('/me', getCurrentUser);

routerUsers.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  }),
  getUser,
);

routerUsers.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

routerUsers.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

routerUsers.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

routerUsers.patch(
  '/me/avatar',
  celebrate(
    {
      body: Joi.object().keys({ avatar: Joi.string().required().uri({ scheme: ['http', 'https'] }) }),
    },
  ),
  updateAvatar,
);

module.exports = routerUsers;
