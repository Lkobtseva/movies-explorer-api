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
  const userId = req.user._id;
  const { movieId } = req.params;
  movieSchema.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound(`Фильм с указанным id:${movieId} не найден`);
      } else if (movie.owner.valueOf() === userId) {
        return movie.deleteOne(); // Вернуть промис для последующей обработки
      } else {
        throw new CurrentErr('Вы не являетесь владельцем карточки с фильмом');
      }
    })
    .then(() => res.status(200).send({ message: 'Фильм удалён' })) // Отправить ответ после удаления
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest(`Передан некорректный id:${movieId}`));
      } else { next(err); }
    });
};