const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route example
router.get('/protected', protect, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.user.userId });
});

module.exports = router;