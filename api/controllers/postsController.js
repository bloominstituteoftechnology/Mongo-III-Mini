const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const STATUS_USER_ERROR = 422;

/* Fill in each of the below controller methods */
const createPost = (req, res) => {

};

const listPosts = (req, res) => {

};

const findPost = (req, res) => {

};

const addComment = (req, res) => {

};

// In this function, we need to delete the comment document
// We also need to delete the comment's parent post's reference
// to the comment we just deleted
const deleteComment = (req, res) => {

};

// Similarly, in this function we need to delete the post document,
// along with any comments that are the children of this post
// We don't want any orphaned children in our database
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

