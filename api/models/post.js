const mongoose = require('mongoose');

mongoose.connect(
    'mongodb://localhost:27017/posts-db',
    { useMongoClient: true }
);

const PostSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
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
