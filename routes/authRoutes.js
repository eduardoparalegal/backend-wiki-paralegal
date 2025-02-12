// routes/authRoutes.js
const router = require('express').Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, (req, res) => {
  res.json({ message: 'Ruta protegida', userId: req.user.userId });
});

module.exports = router;