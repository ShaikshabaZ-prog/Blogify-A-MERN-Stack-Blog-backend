const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, password, role } = req.body;

    if (!name || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ name });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, password: hashedPassword, role });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get user by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};
