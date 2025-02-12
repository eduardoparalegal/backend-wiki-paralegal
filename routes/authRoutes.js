// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida de ejemplo
router.get('/me', protect, (req, res) => {
  res.json({ message: 'Ruta protegida', userId: req.user.userId });
});

module.exports = router;

// server.js (fragmento relevante)
const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Asegúrate de que esto está antes de las rutas
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);