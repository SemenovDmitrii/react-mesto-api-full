const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  getUsers,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  }),
  getUser,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate(
    {
      body: Joi.object().keys({ avatar: Joi.string().required().uri({ scheme: ['http', 'https'] }) }),
    },
  ),
  updateAvatar,
);

module.exports = router;
