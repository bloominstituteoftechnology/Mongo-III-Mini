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

  app
    .route('/posts/:id/comments')
    .post(controllerMethods.addComment);

  app
    .route('/posts/:id/comments/:commentId')
    .delete(controllerMethods.deleteComment);
};

/*

###env
base_url = 'http://localhost:3000'
###env

get(base_url + '/posts');
get(base_url + '/posts/' + '59f185609e5d841575462056')
post(base_url + '/posts', json = {
  "title": "Hello",
  "text": "World"
})
post(base_url + '/posts/' + '59f185609e5d841575462056' + '/comments', json = {
  "text": "LOL"
})
delete(base_url + '/posts/' + '59f185609e5d841575462056')
delete(base_url + '/posts/%s/comments/%s' % ('59f185609e5d841575462056','59f185a573e73d15ce56f82a'))
*/
