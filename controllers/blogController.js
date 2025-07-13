const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().populate('author', 'name role');
  res.json(blogs);
};

exports.getUserBlogs = async (req, res) => {
  const blogs = await Blog.find({ author: req.params.userId });
  res.json(blogs);
};

exports.createBlog = async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      author: req.user.id,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this blog' });
    }

    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.tags = req.body.tags;
    blog.category = req.body.category;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'name role');
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
};
