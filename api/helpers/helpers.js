const Post = require('../models/post.js');

const handleErr = (status, message, res) => res.status(status).json({ Error: message });

const getPost = async (id, res) => {
  const post = await Post.findById(id).populate('comments', 'text');
  if (!post) return handleErr(422, 'Invalid post ID', res);
  return post;
};

module.exports = { handleErr, getPost };
