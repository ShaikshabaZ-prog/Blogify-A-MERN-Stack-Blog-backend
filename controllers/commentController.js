const mongoose = require('mongoose');
const Comment = require('../models/comment');


exports.addComment = async (req, res) => {
  const { content, user } = req.body;
  const { blogId } = req.params;

  if (!content || !user) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const comment = await Comment.create({ blog: blogId, content, user });
  res.status(201).json(comment);
};

exports.getCommentsByBlog = async (req, res) => {
  const { blogId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: 'Invalid blog ID format' });
  }

  try {
    const comments = await Comment.find({ blog: blogId }).sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

exports.deleteComment = async (req, res) => {
  const { blogId, id } = req.params;
  const { user, role } = req.body;

  const comment = await Comment.findOne({ _id: id, blog: blogId });
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  if (role !== 'admin' && comment.user !== user) {
    return res.status(403).json({ message: 'Unauthorized to delete this comment' });
  }

  await Comment.deleteOne({ _id: id });
  res.json({ message: 'Comment deleted successfully' });
};
