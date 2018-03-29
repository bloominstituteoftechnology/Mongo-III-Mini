const mongoose = require('mongoose');
const Post = require('../models/post');
const Comment = require('../models/comment');

const STATUS_USER_ERROR = 422;

const createPost = (req, res) => {
    const { title, text } = req.query;
    const newPost = new Post({ title, text });
    newPost.save()
        .then((newPost) => {
            res.json(newPost);
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json({ stack: err.stack, message: err.message });
        });
};

const listPosts = (req, res) => {
    Post.find({})
        .populate('comments', 'text')
        .exec()
        .then((posts) => {
            res.json(posts);
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json({ stack: err.stack, message: err.message });
        });
};

const findPost = (req, res) => {
    const { id } = req.params;
    Post.findById(id)
        .populate('comments', 'text')
        .exec()
        .then((post) => {
            res.json(post);
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json({ stack: err.stack, message: err.message });
        });
};

const addComment = (req, res) => {
    const { id } = req.params;
    const { text } = req.query;

    const newComment = new Comment({ _parent: id, text });
    newComment.save()
        .then((comment) => {
            Post.findById(id)
                .exec()
                .then((post) => {
                    post.comments.push(comment);
                    post.save();
                    res.send({ success: true });
                })
                .catch((err) => {
                res.status(STATUS_USER_ERROR);
                res.json({ stack: err.stack, message: err.message });
            });
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json({ stack: err.stack, message: err.message });
        });
};

const deleteComment = (req, res) => {
    const { id, commentId } = req.params;

    const comment = Comment.findByIdAndRemove(commentId)
        .exec()
        .then((comment) => {
            return Promise.resolve(comment);
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json({ stack: err.stack, message: err.message });
        });

    Post.findById(id)
        .exec()
        .then((post) => {
            const index = post.comments.findIndex((c) => {
                c._id === comment._id;
            });
            post.comments.splice(index, 1);
            res.json({ success: true });
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json({ stack: err.stack, message: err.message });
        });
};

const deletePost = (req, res) => {
    const { id } = req.params;
    console.log('id: ', id);
    const comments = Post.findByIdAndRemove(id)
        .exec()
        .then((post) => {
            return Promise.resolve(post.comments);
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json({ stack: err.stack, message: err.message });
        });

    Comment.remove({
        '_id': { $in: comments }
    })
    .exec()
    .then(() => {
        res.send({ success: true });
    })
    .catch((err) => {
        res.status(STATUS_USER_ERROR);
        res.json({ stack: err.stack, message: err.message });
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
