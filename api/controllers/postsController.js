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
