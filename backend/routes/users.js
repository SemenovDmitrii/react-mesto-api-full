const router = require('express').Router();

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

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', validateUserId, getUser);

router.patch('/me', validatePatchUserProfile, updateUser);

router.patch('/me/avatar', validatePatchAvatar, updateAvatar);

module.exports = router;
