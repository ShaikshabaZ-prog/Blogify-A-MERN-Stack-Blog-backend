const express = require('express');
const router = express.Router();
const {
    register, login, getUsers, getUserById
} = require('../controllers/authController');

const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user' });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

module.exports = router;

