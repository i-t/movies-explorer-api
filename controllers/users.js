const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadRequestError = require('../utils/errors/BadRequestError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
// const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');

const { signToken } = require('../middlewares/auth');

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create(
      {
        email,
        password: hash,
        name,
      },
    ))
    .then(() => res.status(201)
      .send({
        email,
        name,
      }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } return next(err);
    });
};

module.exports.getMyInfo = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
};

module.exports.updateInfo = (req, res, next) => {
  const { name, email } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Некорректные данные. ${err.message}`));
      } return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный email или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            throw new UnauthorizedError('Неверный email или пароль');
          }
          const token = signToken({ _id: user._id });

          return res.status(200).send({ token });
        });
    })
    .catch(next);
};
