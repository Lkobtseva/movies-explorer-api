const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { isUrlValid } = require('../utils/isUrlValid');

const UnauthorisedError = require('../errors/AuthErr');
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?[\w-]+(\.[a-z])+[\w~!@#$%&*()-+=:;\\'",.?/]+#?/gi.test(v);
      },
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?[\w-]+(\.[a-z])+[\w~!@#$%&*()-+=:;\\'",.?/]+#?/gi.test(v);
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?[\w-]+(\.[a-z])+[\w~!@#$%&*()-+=:;\\'",.?/]+#?/gi.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ссылка на модель пользователя
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
