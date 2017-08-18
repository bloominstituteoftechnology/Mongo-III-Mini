const mongoose = require('mongoose');

mongoose.connect(
    'mongodb://localhost:27017/posts-db',
    { useMongoClient: true }
);

const CommentSchema = new mongoose.Schema({
    _parent: { 
        type: Number, 
        ref: 'Post'
    },
    _id: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Comment', CommentSchema);
