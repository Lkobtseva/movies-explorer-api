const userSchema = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');
const NotFound = require('../errors/NotFound'); // 404

module.exports.getUserInfo = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданны некорректные данные');
      }
      return next(err);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;

  userSchema.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданны некорректные данные');
      } else if (err.name === 'CastError') {
        throw new BadRequest('Переданны некорректные данные');
      } else if (err.codeName === 'DuplicateKey') {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      return next(err);
    })
    .catch(next);
};