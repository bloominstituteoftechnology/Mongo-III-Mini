const controllerMethods = require('../controllers/postsController');

module.exports = (app) => {
  app
    .route('/posts')
    .get(controllerMethods.listPosts)
    .post(controllerMethods.createPost);

  app
    .route('/posts/:id')
    .get(controllerMethods.findPost)
    .delete(controllerMethods.deletePost);

  app.route('/posts/:id/comments').post(controllerMethods.addComment);

  app
    .route('/posts/:id/comments/:commentId')
    .delete(controllerMethods.deleteComment);
};
