const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const STATUS_USER_ERROR = 422;

exports.createPost = (req, res) => {
    const { title, text } = req.body;
    const newPost = new Post({ title, text });
    newPost.save().exec()
        .then((newPost) => {
            res.json(newPost);
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json(err);
        });
};

exports.listPosts = (req, res) => {
    Post.find({}).exec()
        .then((posts) => {
            posts.populate(_parent, comments);
            res.send(posts);
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json(err);
        });
};

exports.findPost = (req, res) => {
    const { id } = req.params;
    Post.findById(id).exec()
        .then((post) => {
            post.populate(_parent, comments);
            res.send(post);
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json(err);
        });
};

exports.addComment = (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    let newComment = new Comment({ _parent: id, text });
    newComment = newComment.save().exec()
        .then((comment) => {
            return Promise.resolve(comment);
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json(err);
        });

    Post.findById(id).exec()
        .then((post) => {
            post.comments.push(newComment._id);
            post.save();
            res.send({ success: true });
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json(err);
        });
};

exports.deleteComment = (req, res) => {
    const { id, commentId } = req.params;

    Comment.findByIdAndRemove(commentId).exec()
       .catch((err) => {
           res.status(STATUS_USER_ERROR);
           res.json(err);
       });

    Post.findById(id).exec()
        .then((post) => {
            const index = post.comments.findIndex((c) => {
                c._id === comment._id;
            });
            post.comments.split(index, 1);
            res.json({ success: true });
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json(err);
        });
};

exports.deletePost = (req, res) => {
    const { id } = req.params;
    
    const comments = Post.findByIdAndRemove(id).exec()
        .then((post) => {
            return Promise.resolve(post.comments);
        })
        .catch((err) => {
            res.status(STATUS_USER_ERROR);
            res.json(err);
        });

   Comment.remove({
       '_id': { $in: comments }
   }).exec()
    .then(() => {
        res.send({ success: true });
    })
    .catch((err) => {
        res.status(STATUS_USER_ERROR);
        res.json(err);
    });
};

