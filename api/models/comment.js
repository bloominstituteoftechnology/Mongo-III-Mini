const mongoose = require('mongoose');

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
