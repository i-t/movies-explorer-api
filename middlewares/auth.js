const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const { NODE_ENV, SECRET_KEY } = process.env;

function checkToken(token) {
  return jwt.verify(token, SECRET_KEY || 'secret-dev-key');
}

function signToken(payload) {
  return jwt.sign(payload, NODE_ENV === 'production' ? SECRET_KEY : 'secret-dev-key', { expiresIn: '30d' });
}

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError('Нет заголовка авторизации'));
  }
  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const payload = checkToken(token);
    req.user = {
      _id: new mongoose.Types.ObjectId(payload._id),
    };
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Пользователь не авторизован'));
  }
};

module.exports = {
  signToken,
  auth,
};
