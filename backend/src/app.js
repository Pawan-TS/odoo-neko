const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const workloadRoutes = require('./routes/workloadRoutes');
const moodRoutes = require('./routes/moodRoutes');
const dependencyRoutes = require('./routes/dependencyRoutes');
const tunnelRoutes = require('./routes/tunnelRoutes');

// Import error handling utilities
const { errorConverter, errorHandler, notFound } = require('./utils/errorHandler');

// Initialize express app
const app = express();

// Basic middleware
app.use(helmet()); // Security headers
app.use(cors());   // CORS support
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API version prefix
const API_PREFIX = '/api/v1';

// Mount routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/projects`, projectRoutes);
app.use(`${API_PREFIX}/tasks`, taskRoutes);
app.use(`${API_PREFIX}/workload`, workloadRoutes);
app.use(`${API_PREFIX}/mood`, moodRoutes);
app.use(`${API_PREFIX}/dependencies`, dependencyRoutes);
app.use(`${API_PREFIX}/tunnels`, tunnelRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Default route for API
app.get(API_PREFIX, (req, res) => {
  res.status(200).json({
    message: 'Welcome to SynergySphere API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// 404 handler for undefined routes
app.use(notFound);

// Error converter
app.use(errorConverter);

// Error handler
app.use(errorHandler);

module.exports = app;