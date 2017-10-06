const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Post', PostSchema);
