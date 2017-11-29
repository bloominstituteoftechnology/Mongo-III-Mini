const mongoose = require('mongoose');

const Post = require('../models/post');
const Comment = require('../models/comment');

const STATUS_USER_ERROR = 422;

/* Fill in each of the below controller methods */
const createPost = (req, res) => {
	const { title, text } = req.body;
	const post = new Post({ title, text });
	post.save((err, post) => {
		if(err) {
			res.status(STATUS_USER_ERROR).json({'something went wrong': err});
			return;
		}
		res.status(200).json(post);
	}); 
};

const listPosts = (req, res) => {
	Post.find({}, (err, posts) => {
		if(err) {
			res.status(STATUS_USER_ERROR).json({'something went wrong': err});
			return;
		}
		res.status(200).json(posts);
	})
};

const findPost = (req, res) => {
	const { id } = req.params;
	Post.findById(id, (err, post) => {
		if(err) {
			res.status(STATUS_USER_ERROR).json({'something went wrong': err});
			return;
		}
		res.status(200).json(post);
	});
};

const addComment = (req, res) => {
	const _parent = req.params.id;
	const { text } = req.body;
	console.log(_parent + ' - ' + text);
	const comment = new Comment({ _parent, text });
	comment.save((err, com) => {
		if(err) {
			res.status(STATUS_USER_ERROR).json({'something went wrong first query': err});
			return;
		}
		Post.findOneAndUpdate({ _id: com._parent }, {
			$push: { comments: com._id }
		}, (err2, post) => {
			if(err2) {
				res.status(STATUS_USER_ERROR).json({'something went wrong the second query': err2});
				return;
			}
			res.status(200).json(com);
		});
	});
};

// In this function, we need to delete the comment document
// We also need to delete the comment's parent post's reference
// to the comment we just deleted
const deleteComment = (req, res) => {
	const id = req.params.commentId;
	Comment.remove({ _id: id }, (err, doc) => {
		if(err) {
			res.status(STATUS_USER_ERROR).json({'something went wrong': err});
			return;
		}
		res.status(200).json(doc);
	});
};

// Similarly, in this function we need to delete the post document,
// along with any comments that are the children of this post
// We don't want any orphaned children in our database
const deletePost = (req, res) => {
	const { id } = req.params;
	Post.remove({ _id: id }, (err, doc) => {
		if(err) {
			res.status(STATUS_USER_ERROR).json({'something went wrong': err});
			return;
		}
		res.status(200).json(doc);
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

