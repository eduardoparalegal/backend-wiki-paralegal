const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);

    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log('Database ping successful');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error.name === 'MongoServerError') {
      console.error('MongoDB Server Error Code:', error.code);
      console.error('MongoDB Server Error Message:', error.errmsg);
    }
    process.exit(1);
  }
};

module.exports = connectDB;