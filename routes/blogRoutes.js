const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllBlogs,
  getUserBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

router.get('/', getAllBlogs);
router.get('/user/:userId', getUserBlogs);
router.get('/:id', getBlogById);
router.post('/',protect, createBlog);
router.put('/:id',protect, updateBlog);
router.delete('/:id',protect, deleteBlog);

module.exports = router;
