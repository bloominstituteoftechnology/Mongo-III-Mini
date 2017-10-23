const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const STATUS_USER_ERROR = 422;

/* Fill in each of the below controller methods */
const createPost = async (req, res) => {
  const { title, text } = req.body;
  try {
    const post = await Post({ title, text }).save();
    return res.json(post);
  } catch (error) {
    return res.status(STATUS_USER_ERROR).json(error);
  }
};

const listPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('comments');
    return res.json(posts);
  } catch (error) {
    return res.status(STATUS_USER_ERROR).json(error);
  }
};

const findPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate('comments');
    return res.json(post);
  } catch (error) {
    return res.status(STATUS_USER_ERROR).json(error);
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const post = await Post.findById(id);
    const comment = await Comment({ _parent: id, text }).save();
    post.comments.push(comment);
    await post.save();
    return res.json(comment);
  } catch (error) {
    return res.status(STATUS_USER_ERROR).json(error);
  }
};

// In this function, we need to delete the comment document
// We also need to delete the comment's parent post's reference
// to the comment we just deleted
const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  try {
    await Post.update({ _id: id }, { $pull: { comments: { _id: commentId } } });
    await Comment.findByIdAndRemove(commentId);
    return res.json({ message: 'Successfully deleted comment' });
  } catch (error) {
    return res.status(STATUS_USER_ERROR).json(error);
  }
};

// Similarly, in this function we need to delete the post document,
// along with any comments that are the children of this post
// We don't want any orphaned children in our database
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndRemove(id);
    await Comment.remove({ _parent: id });
    return res.json({ message: 'Successfully deleted post' });
  } catch (error) {
    return res.status(STATUS_USER_ERROR).json(error);
  }
};

module.exports = {
  createPost,
  listPosts,
  findPost,
  addComment,
  deleteComment,
  deletePost,
};
