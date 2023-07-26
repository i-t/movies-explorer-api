const usersRouter = require('express').Router();

const usersController = require('../controllers/users');
const { validateEditUser } = require('../middlewares/validation');

usersRouter.get('/me', usersController.getMyInfo);
usersRouter.patch('/me', validateEditUser, usersController.updateInfo);

// usersRouter.get('/me', usersController.getMyInfo);
// usersRouter.patch('/me', usersController.updateInfo);

module.exports = usersRouter;
