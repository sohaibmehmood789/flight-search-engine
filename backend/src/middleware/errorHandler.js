/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Amadeus API errors
  if (err.response?.data) {
    return res.status(err.response.status || 500).json({
      success: false,
      error: err.response.data.errors || err.response.data.error_description || 'API Error',
      message: 'Failed to fetch data from Amadeus API'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message,
      details: err.details
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Async error wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
