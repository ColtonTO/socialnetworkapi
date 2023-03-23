const router = require('express').Router();

const {
  getAllThoughts,
  getThoughtsById,
  createThoughts,
  updateThoughts,
  deleteThoughts,
  createReaction,
  deleteReaction
} = require('../../controllers/thought-controller');

router
  .route('/')
  .get(getAllThoughts)
  .post(createThoughts);

router
  .route('/:id')
  .get(getThoughtsById)
  .put(updateThoughts)
  .delete(deleteThoughts);

router
  .route('/:thoughtId/reactions')
  .post(createReaction);

  router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);

module.exports = router;