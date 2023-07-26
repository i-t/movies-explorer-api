const moviesRouter = require('express').Router();

const moviesController = require('../controllers/movies');
const { validateCreateMovie, validateMovieId } = require('../middlewares/validation');

moviesRouter.get('/', moviesController.getMovies);
moviesRouter.post('/', validateCreateMovie, moviesController.createMovie);
moviesRouter.delete('/:movieId', validateMovieId, moviesController.deleteMovies);

module.exports = moviesRouter;
