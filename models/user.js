const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Укажите email'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
    },
  },
  password: {
    type: String,
    required: [true, 'Укажите пароль'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Укажите имя'],
    minlength: [2, 'Минимум 2 символа'],
    maxlength: [30, 'Максимум 30 символов'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
