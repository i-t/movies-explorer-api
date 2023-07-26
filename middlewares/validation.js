const { celebrate, Joi } = require('celebrate');
const { REGEX_URL } = require('../utils/constants');

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4).max(16),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4).max(16),
  }),
});

module.exports.validateEditUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
  }),
});

// module.exports.validationUserById = celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().alphanum().length(24).hex(),
//   }),
// });

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(REGEX_URL),
    trailerLink: Joi.string().required().regex(REGEX_URL),
    thumbnail: Joi.string().required().regex(REGEX_URL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});
