const mongoose = require('mongoose');
const Movie = require('../models/movie');

const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie
    .find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user._id,
      movieId,
      nameRU,
      nameEN,
    })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Некорректные данные. ${err.message}`));
      } else {
        next(err);
      }
    });
};

const deleteMovies = (req, res, next) => {
  const { movieId } = req.params;
  Movie
    .findById(movieId)
    .orFail()
    .then((movie) => {
      const owner = movie.owner.toString();
      const user = req.user._id.toString();
      if (owner === user) {
        return Movie.deleteOne(movie)
          .then(() => {
            res.status(200).send({ message: 'Фильм удален' });
          });
      }
      return next(new ForbiddenError('У вас недостаточно прав'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Фильм не найден'));
      } else {
        next(err);
      }
    });
};

// const likeMovie = (req, res, next) => Movie
//   .findByIdAndUpdate(
//     req.params.movieId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true, runValidators: true },
//   )
//   .then((movie) => {
//     if (!movie) {
//       throw new NotFoundError('Карточка не найдена');
//     }
//     res.status(200).send(movie);
//   })
//   .catch((err) => {
//     if (err.name === 'CastError') {
//       next(new BadRequestError('Некорректные данные'));
//     } else {
//       next(err);
//     }
//   });

// const dislikeMovie = (req, res, next) => Movie
//   .findByIdAndUpdate(
//     req.params.movieId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//   .then((movie) => {
//     if (!movie) {
//       throw new NotFoundError('Карточка не найдена');
//     }
//     res.status(200).send(movie);
//   })
//   .catch((err) => {
//     if (err.name === 'CastError') {
//       next(new BadRequestError('Некорректные данные'));
//     } else {
//       next(err);
//     }
//   });

module.exports = {
  getMovies,
  createMovie,
  deleteMovies,
  // likeMovie,
  // dislikeMovie,
};
