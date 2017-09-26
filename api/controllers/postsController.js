const mongoose = require('mongoose');
const { handleErr, getPost } = require('../helpers/helpers');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const createPost = async (req, res) => {
  const { title, text } = req.body;
  try {
    const newPost = new Post({ title, text });
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    handleErr(422, err.message, res);
  }
};

const listPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate('comments', 'text');
    res.status(200).json(posts);
  } catch (err) {
    handleErr(404, err.message, res);
  }
};

const findPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await getPost(id);
    res.status(200).json(post);
  } catch (err) {
    handleErr(422, err.message, res);
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const post = await getPost(id);
    if (post) {
      const newComment = new Comment({ _parent: id, text });
      await newComment.save();
      post.comments.push(newComment.id);
      await post.save();
      return res.status(201).json({ Success: 'Comment added' });
    }
    return handleErr(404, `Post ${id} was not found.`, res);
  } catch (err) {
    handleErr(422, err.message, res);
  }
};

// In this function, we need to delete the comment document
// We also need to delete the comment's parent post's reference
// to the comment we just deleted
const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  try {
    const post = await getPost(id);
    const comment = await Comment.findByIdAndRemove(commentId);
    const index = post.comments.findIndex(i => i == comment.id);
    post.comments.splice(index, 1);
    post.save();
    res.status(200).json({ Success: `Post ${id} was deleted` });
  } catch (err) {
    handleErr(422, err.message, res);
  }
};

// Similarly, in this function we need to delete the post document,
// along with any comments that are the children of this post
// We don't want any orphaned children in our database
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndRemove(id);
    if (!post) return handleErr(404, `Post ${id} was not found`, res);
    await Comment.remove({ _parent: id });
    res.status(200).json({ Success: `Post ${id} was removed` });
  } catch (err) {
    res.status(422).json(err.message);
  }
};

module.exports = {
  createPost,
  listPosts,
  findPost,
  addComment,
  deleteComment,
  deletePost
};

