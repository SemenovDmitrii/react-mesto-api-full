const router = require('express').Router();
const {
  validateUserId, validateUserUpdate, validateUserAvatar,
} = require('../middlewares/celebrate');

const {
  getUser,
  getUsers,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validateUserId, getUser);
router.patch('/me', validateUserUpdate, updateUser);
router.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
