// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        message: 'Por favor proporcione usuario y contraseña',
        error: true
      });
    }

    const user = await User.findOne({ username }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Usuario o contraseña incorrectos',
        error: true
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      message: 'Inicio de sesión exitoso',
      userId: user._id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error durante el inicio de sesión',
      error: true
    });
  }
};