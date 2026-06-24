const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  const authMessages = [
    'Invalid email or password',
    'Email already registered',
    'Account suspended',
    'Validation error',
    'Invalid or expired OTP'
  ];

  if (authMessages.some(m => message.startsWith(m) || message === m)) {
    if (!err.statusCode) statusCode = 401;
  }

  if (message === 'Validation error') {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(err.errorCode && { errorCode: err.errorCode }),
    ...(err.authMethod && { authMethod: err.authMethod })
  });
};

module.exports = errorHandler;
