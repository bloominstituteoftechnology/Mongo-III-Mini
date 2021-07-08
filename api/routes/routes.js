const express = require('express');
const controllerMethods = require('../controllers/postsController');

const router = express.Router();

router
  .route('/posts')
  .get(controllerMethods.listPosts)
  .post(controllerMethods.createPost);

router
  .route('/posts/:id')
  .get(controllerMethods.findPost)
  .delete(controllerMethods.deletePost);

router
  .route('/posts/:id/comments')
  .post(controllerMethods.addComment);

router
  .route('/posts/:id/comments/:commentId')
  .delete(controllerMethods.deleteComment);

module.exports = router;
