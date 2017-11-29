const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  _parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    res: 'User',
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
