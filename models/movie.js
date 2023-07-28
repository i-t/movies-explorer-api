const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Страна создания фильма'],
  },
  director: {
    type: String,
    required: [true, 'Режиссёр фильма'],
  },
  duration: {
    type: Number,
    required: [true, 'Продолжительность фильма'],
  },
  year: {
    type: String,
    required: [true, 'Год выпуска фильма'],
  },
  description: {
    type: String,
    required: [true, 'Описание фильма'],
  },
  image: {
    type: String,
    required: [true, 'Ссылка на постер к фильму'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Ссылка на трейлер к фильму'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Миниатюрное изображение постера к фильму'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Id пользователя, который сохранил фильм'],
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: [true, 'Id фильма'],
  },
  nameRU: {
    type: String,
    required: [true, 'Название фильма на русском языке'],
  },
  nameEN: {
    type: String,
    required: [true, 'Название фильма на английском языке'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
