/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error converter - convert generic errors to ApiError
 */
const errorConverter = (err, req, res, next) => {
  let error = err;
  
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  
  next(error);
};

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  // Set default values if not defined
  statusCode = statusCode || 500;
  
  // Log error for debugging (would use proper logging in production)
  console.error(`[ERROR] ${statusCode} - ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Send response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

/**
 * Create a new ApiError instance
 */
const createError = (statusCode, message) => {
  return new ApiError(statusCode, message);
};

/**
 * Handle 404 errors
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Resource not found - ${req.originalUrl}`));
};

/**
 * Handle database errors specifically
 */
const handleDatabaseError = (err) => {
  // Handle specific database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return new ApiError(409, 'Duplicate entry found');
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW') {
    return new ApiError(400, 'Referenced record not found');
  }
  
  // Default database error
  return new ApiError(500, 'Database error occurred');
};

module.exports = {
  ApiError,
  errorConverter,
  errorHandler,
  createError,
  notFound,
  handleDatabaseError
};