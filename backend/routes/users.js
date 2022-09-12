const routerUsers = require('express').Router();

const {
  validateUserId,
  validatePatchUserProfile,
  validatePatchAvatar,
} = require('../middlewares/validation');

const {
  getUser,
  getUsers,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routerUsers.get('/', getUsers);

routerUsers.get('/me', getCurrentUser);

routerUsers.get('/:id', validateUserId, getUser);

routerUsers.patch('/me', validatePatchUserProfile, updateUser);

routerUsers.patch('/me/avatar', validatePatchAvatar, updateAvatar);

module.exports = routerUsers;
