const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { isUrlValid } = require('../utils/isUrlValid');

const UnauthorisedError = require('../errors/AuthErr');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неверный формат email', // когда validator вернёт false, будет использовано это сообщение
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorisedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorisedError('Неправильные почта или пароль');
          } return user;
        });
    });
};

userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

module.exports = mongoose.model('user', userSchema);
