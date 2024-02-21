const express = require('express');
const movieRoutes = require('express').Router();
const {
  getAllSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validationCreateMovie,
  validationMovieById,
} = require('../middlewares/validation');


movieRoutes.get('/', getAllSavedMovies);
movieRoutes.post('/', validationCreateMovie, createMovie);
movieRoutes.delete('/:_id', validationMovieById, deleteMovie);

module.exports = movieRoutes;