const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const STATUS_USER_ERROR = 422;

/* Fill in each of the below controller methods */
const createPost = (req, res) => {
  const { title, text } = req.body;
  const newPost = new Post({ title, text });
  newPost
    .save()
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.status(STATUS_USER_ERROR);
      res.json({ message: err.message });
    });
};

const listPosts = (req, res) => {
  Post.find({})
    .populate('comments')
    .exec()
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(STATUS_USER_ERROR);
      res.json({ message: err.message });
    });
};


const findPost = (req, res) => {
  Post.findById(req.params.id)
    .populate('comments')
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.status(STATUS_USER_ERROR);
      res.json({ message: err.message });
    });
};

const addComment = (req, res) => {
  const { text } = req.body;
  const newComment = new Comment({ text });
  newComment
    .save()
    .then((comment) => {
      Post.findById(req.params.id)
        .exec()
        .then((post) => {
          post.comments.push(comment);
          post.save();
          res.send({ success: true });
        })
        .catch((err) => {
          res.status(STATUS_USER_ERROR);
          res.json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(STATUS_USER_ERROR);
      res.json({ message: err.message });
    });
};

// In this function, we need to delete the comment document
// We also need to delete the comment's parent post's reference
// to the comment we just deleted
const deleteComment = (req, res) => {
  Post.findById(req.params.id)
  .exec()
  .then((post) => {
    const comment = Comment.findById(req.params.id);
    comment.remove();
  })
  .catch((err) => {
    res.status(STATUS_USER_ERROR);
    res.json({ message: err.message });
  });
};

// Similarly, in this function we need to delete the post document,
// along with any comments that are the children of this post
// We don't want any orphaned children in our database
const deletePost = (req, res) => {};

module.exports = {
  createPost,
  listPosts,
  findPost,
  addComment,
  deleteComment,
  deletePost
};
