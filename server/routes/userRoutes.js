const express = require('express');
const { registerUser, authUser, getUserProfile, getAllUsers } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, authorizeRoles('admin'), getAllUsers);

module.exports = router;