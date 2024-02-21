const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

// создаем пользователя
module.exports.createUsers = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    userSchema
      .create({
        name, email, password: hash,
      })
      .then(() => res.status(201).send(
        {
          data: {
            name, email,
          },
        },
      ))
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким email уже существует'));
        }
        if (err.name === 'ValidationError') {
          return next(new BadRequest('Некорректные данные'));
        }
        next(err);
      });
  })
    .catch(next);
};
// проверяем почту и пароль
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return userSchema
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res.status(200).send({ token });
    })
    .catch(next);
};