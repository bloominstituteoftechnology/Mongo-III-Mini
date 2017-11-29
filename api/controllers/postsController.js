const mongoose = require('mongoose');

const Post = require('../models/post.js');
const Comment = require('../models/comment.js');

const STATUS_USER_ERROR = 422;

/* Fill in each of the below controller methods */
const createPost = (req, res) => {
  const { title, text } = req.body;
  const newPost = new Post({ title, text });

  newPost
    .save()
    .then(nPost => res.json(nPost))
    .catch(err => res.status(422).json(err));
};

const listPosts = (req, res) => {
  Post
    .find({})
    .populate('comments', 'text')
    .exec()
    .then(posts => res.json(posts))
    .catch(err => res.status(500).json(err));
};

const findPost = (req, res) => {

};

const addComment = (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const newComment = new Comment({ _parent: id, text });

  newComment
    .save()
    .then((comment) => {
      Post
        .findById(id)
        .exec()
        .then((post) => {
          post.comments.push(comment);
          post.save();
          res.json({ success: 'horray!!' });
        })
        .catch(err => res.status(422).json(err));
    })
    .catch(err => res.status(422).json(err));
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

