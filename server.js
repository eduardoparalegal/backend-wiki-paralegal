require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));

// Explicit JSON parsing and type setting BEFORE other middlewares
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://paralegal-wiki.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Demasiados intentos de inicio de sesión, por favor intenta de nuevo más tarde'
});

// Routes
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ 
    message: 'Ocurrió un error en el servidor', 
    error: err.message 
  });
});

const PORT = config.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo de promesa no manejado:', reason);
  server.close(() => process.exit(1));
});

module.exports = app;