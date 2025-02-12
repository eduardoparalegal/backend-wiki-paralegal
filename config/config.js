// config/config.js
const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'tu-secreto-muy-seguro',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://Eduardo:Gatosbellos0@paralegal-a.nfevj.mongodb.net/paralegal',
  PORT: process.env.PORT || 5000,
  CORS_ORIGINS: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://paralegal-wiki.onrender.com',
    'https://backend-wiki-paralegal.onrender.com'
  ]
};

module.exports = config;