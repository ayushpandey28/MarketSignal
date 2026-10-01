function notFound(req, res, next) {
  const error = new Error(`Not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  console.error('[API error]', {
    method: req.method,
    path: req.originalUrl,
    name: err.name,
    code: err.code,
    message: err.message,
  });
  const statusCode = err.statusCode || (err.code === 'LIMIT_FILE_SIZE' ? 400 : 500);
  const message =
    err.code === 'LIMIT_FILE_SIZE'
      ? 'Image must be 2 MB or smaller'
      : statusCode === 500
        ? 'Something went wrong'
        : err.message || 'Request failed';

  res.status(statusCode).json({
    success: false,
    message,
  });
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { notFound, errorHandler, asyncHandler };
