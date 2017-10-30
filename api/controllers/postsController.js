const mongoose = require('mongoose');
const Post = require("../models/post");
const Comment = require("../models/comment");

const STATUS_USER_ERROR = 422;

const errorHandler = (error, req, res, message) => 
  res.status(STATUS_USER_ERROR).send({
      error, 
      message: message || "Oops... Looks like that didn't work",
      received: {
        body: req.body,
        params: req.params,
        query: req.query
      }
    });

/* Fill in each of the below controller methods */
const createPost = (req, res) => {
  let { title, text } = req.body;
  if (title == null || text == null) {
    return errorHandler({
        error: 'IncompletePost',
        require: ['title', 'text']
      }, req, res);
  }
  new Post({ title, text }).save()
    .then((post) => res.send(post))
    .catch((error) => errorHandler(error, req, res));
};

const listPosts = (req, res) => {
  Post.find().populate('comments')
    .then((posts) => {
      if (posts == null || posts.length === 0) {
        return res.send("There's nothing to see here...");
      }
      res.send({posts})
    })
    .catch((error) => errorHandler(error, req, res));
};

const findPost = (req, res) => {
  Post.findOne({_id: req.params.id}).populate('comments')
    .then((post) => {
      res.send(post)
    })
    .catch((error) => errorHandler(error, req, res));
};

const addComment = (req, res) => {
  const { text } = req.body;
  if (text == null) {
    return errorHandler({error: "IncompletePost", require: ['text']}, req, res);
  }
  const parent = req.params.id;
  Post.findOne({_id: parent}).populate('comments')
    .then((post) => {
      new Comment({ _parent: post._id, text: req.body.text }).save()
        .then((comment) => {
          post.comments.push(comment._id);
          post.save()
            .then((post) => res.send(post))
            .catch((error) => errorHandler(error, req, res));
        })
        .catch((error) => errorHandler(error, req, res));
    })
    .catch((error) => errorHandler(error, req, res));
};

// In this function, we need to delete the comment document
// We also need to delete the comment's parent post's reference
// to the comment we just deleted
const deleteComment = (req, res) => {
  Post.findOne({ _id: req.params.id }).populate('comments')
    .then((post) => {
      const index = post.comments.findIndex(comment => comment._id == req.params.commentId);
      const comment = post.comments.splice(index, 1)[0];
      if (comment == null || index === -1) {
        return errorHandler({error: 'PostNotContainComment'}, req, res);
      }
      post.save()
        .then(() => {
          comment.remove()
            .then(() => res.send({ comment, status: 'Deleted' }))
            .catch(error => errorHandler(error, req, res, 'CommentDeleteError'));
        })
        .catch(error => errorHandler(error, req, res, 'PostSaveError'));
    })
    .catch(error => errorHandler(error, req, res, 'PostFindError'));
};

// Similarly, in this function we need to delete the post document,
// along with any comments that are the children of this post
// We don't want any orphaned children in our database
const deletePost = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      Comment.find({ _parent: post._id }).remove()
        .then(() => {
          post.remove()
            .then(() => res.send({ post, status: 'Deleted' }))
            .catch((error) => errorHandler(error, req, res, 'PostDeleteError'));
        })
        .catch((error) => errorHandler(error, req, res, 'CommentDeleteError'));
    })
    .catch((error) => errorHandler(error, req, res, 'PostFindError'));
};

module.exports = {
  createPost,
  listPosts,
  findPost,
  addComment,
  deleteComment,
  deletePost
};

