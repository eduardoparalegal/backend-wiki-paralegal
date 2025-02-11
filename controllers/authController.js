const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .replace(/[\$\{\}\[\]\(\)]|(\$eq)|(\$ne)|(\$gt)|(\$lt)|(\$gte)|(\$lte)|(\$in)|(\$nin)|(\$or)|(\$and)|(\$not)|(\$nor)|(\$exists)/g, '')
    .trim();
};

const validateRequiredFields = (fields) => {
  return Object.entries(fields).every(([key, value]) => {
    return value !== undefined && 
           value !== null && 
           value.toString().trim() !== '' &&
           typeof value === 'string';
  });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });

    if (!validateRequiredFields({ username, password })) {
      console.log('Invalid fields provided');
      return res.status(400).json({ 
        message: 'Credenciales inválidas',
        error: true 
      });
    }

    const sanitizedUsername = sanitizeInput(username);
    console.log('Sanitized username:', sanitizedUsername);

    const user = await User.findOne({ username: sanitizedUsername }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('No user found with username:', sanitizedUsername);
      return res.status(401).json({ 
        message: 'Credenciales inválidas',
        error: true 
      });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password did not match');
      return res.status(401).json({ 
        message: 'Credenciales inválidas',
        error: true 
      });
    }

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '24h' });
    console.log('Token generated successfully');
    
    return res.status(200).json({ 
      token, 
      message: 'Inicio de sesión exitoso',
      userId: user._id
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Error durante el inicio de sesión',
      error: error.message 
    });
  }
};

exports.register = async (req, res) => {
  // Implementación del registro
};