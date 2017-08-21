const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const STATUS_USER_ERROR = 422;

/* Fill in each of the below controller methods */

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (typeof err === 'string') {
    res.json({ error: err });
  } else {
    res.json(err);
  }
};

const createPost = (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    sendUserError('Please enter BOTH a TITLE and TEXT.', res);
    return;
  }
  const post = new Post({ title, text });
  Post.save((err) => {
    if (err) {
      res.json(err);
    } else {
      res.json(post);
    }
  });
};

const listPosts = (req, res) => {
  Post.find({}, (err, posts) => {
    if (!posts) {
      sendUserError('There is nothing posted', res);
      return;
    }
    if (err) {
      sendUserError(err, res);
      return;
    }
    res.json(posts);
  });
};

const findPost = (req, res) => {

};

const addComment = (req, res) => {

};

const deleteComment = (req, res) => {

};

const deletePost = (req, res) => {

};

module.exports = {
  createPost,
  listPosts,
  findPost,
  addComment,
  deleteComment,
  deletePost
};
