const routerUsers = require('express').Router();

const {
  validateCurrentUser,
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

routerUsers.get('/me', getUser);

routerUsers.get('/:userId', validateCurrentUser, getCurrentUser);

routerUsers.patch('/me', validatePatchUserProfile, updateUser);

routerUsers.patch('/me/avatar', validatePatchAvatar, updateAvatar);

module.exports = routerUsers;
