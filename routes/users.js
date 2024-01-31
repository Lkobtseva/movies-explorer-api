const userRoutes = require('express').Router();

const {
  getUserInfo,
  updateUserInfo
} = require('../controllers/users');

const {
  validationUpdateUser,
  validationUserId,
} = require('../middlewares/validation');

userRoutes.get('/me', validationUserId, getUserInfo);
userRoutes.patch('/me', validationUpdateUser, updateUserInfo);

module.exports = userRoutes;