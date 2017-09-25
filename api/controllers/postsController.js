const mongoose = require("mongoose");

const Post = require("../models/post");
const Comment = require("../models/comment");

const STATUS_USER_ERROR = 422;

const errHandler = (res, status, message) => {
  if (status === 500) {
    res.status(status).send({ message: "Server error with your operation." });
  } else {
    res.status(status).send({ message });
  }
  return;
};
/* Fill in each of the below controller methods */
const createPost = (req, res) => {
  const { title, text } = req.body;
  const newPost = new Post({ title, text });
  newPost.save((err, post) => {
    return err ? errHandler(res, 500) : res.json(post);
  });
};

const listPosts = (req, res) => {
  Post.find()
    .populate("comments")
    .exec((err, posts) => {
      if (err) return errHandler(res, 500);
      return posts
        ? res.json(posts)
        : errHandler(res, 422, "Posts are not on this db.");
    });
};

const findPost = (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .populate("comments")
    .exec()
    .then(post => {
      return post
        ? res.json(post)
        : errHandler(res, 422, "This post doesnt exist on our server");
    })
    .catch(err => errHandler(res, 500));
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const commentBody = {
    _parent: id,
    text: req.body.text
  };
  const comment = await new Comment(commentBody).save();
  Post.findByIdAndUpdate(
    id,
    { $push: { comments: comment._id } },
    { new: true, upsert: true, safe: true },
    (err, post) => {
      return err ? errHandler(res, 500) : res.json(post);
    }
  );
};

// In this function, we need to delete the comment document
// We also need to delete the comment's parent post's reference
// to the comment we just deleted
const deleteComment = (req, res) => {
  const { commentId, id } = req.params;
  Comment.findByIdAndRemove(commentId, (err, result) => {
    if (err) return errHandler(res, 500);
    Post.findByIdAndUpdate(
      id,
      { $pull: { comment: commentId } },
      { safe: true, upsert: true, new: true },
      (updateErr, post) => {
        return updateErr ? errHandler(res, 500) : res.json(post);
      }
    );
  });
};

// Similarly, in this function we need to delete the post document,
// along with any comments that are the children of this post
// We don't want any orphaned children in our database
const deletePost = (req, res) => {
  const { id } = req.params;
  Post.findByIdAndRemove(id, (err, post) => {
    if (err) return errHandler(res, 500);
    Comment.remove({ _parent: id }, (commentErr, response) => {
      return commentErr ? errHandler(res, 500) : res.json(post);
    });
  });
};

module.exports = {
  createPost,
  listPosts,
  findPost,
  addComment,
  deleteComment,
  deletePost
};
