const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addComment,
  getCommentsByBlog,
  deleteComment
} = require('../controllers/commentController');

router.post('/:blogId', addComment);
router.get('/:blogId', getCommentsByBlog);
router.delete('/:blogId/:id',protect, deleteComment); 
module.exports = router;
