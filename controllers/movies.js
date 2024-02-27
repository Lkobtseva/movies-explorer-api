const movieSchema = require('../models/movie');
const NotFound = require('../errors/NotFound'); // 404
const CurrentErr = require('../errors/CurrentErr'); // 403
const BadRequest = require('../errors/BadRequest'); // 400


module.exports.getAllSavedMovies = (req, res, next) => {
  const owner = req.user._id;

  movieSchema.find({ owner })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  movieSchema.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send({
      _id: movie._id,
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailerLink,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные');
      }
      return next(err);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  movieSchema.findById(req.params.movieId).select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Пользователь не найден');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new CurrentErr('Вы не можете удалить чужой фильм');
      }

      return movieSchema.findByIdAndDelete(req.params.movieId).select('-owner');
    })
    .then((deletedMovie) => res.status(200).send(deletedMovie))
    .catch(next);
};