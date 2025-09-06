require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/db');

// Environment variables with defaults
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to database
db.testConnection()
  .then(() => {
    console.log('📦 Connected to MySQL database');
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Server running in ${NODE_ENV} mode on port ${PORT}
🔗 API available at http://localhost:${PORT}/api/v1
🩺 Health check at http://localhost:${PORT}/health
      `);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      
      // Close server & exit process
      server.close(() => {
        process.exit(1);
      });
    });
    
    // Handle SIGTERM
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });