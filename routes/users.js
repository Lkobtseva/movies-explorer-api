const userRoutes = require('express').Router();

const {
  getUserInfo,
  updateUserInfo
} = require('../controllers/users');

const {
  validationUpdateUser,
} = require('../middlewares/validation');

userRoutes.get('/me', getUserInfo);
userRoutes.patch('/me', validationUpdateUser, updateUserInfo);

module.exports = userRoutes;