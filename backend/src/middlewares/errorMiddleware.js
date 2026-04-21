const errorHandler = (err, req, res, next) => {
  // ✅ fallback safety
  if (!err) {
    err = new Error("Unknown error occurred");
  }

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Server Error";

  // ✅ Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // ✅ Mongoose duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // ✅ Mongoose validation error (convert array → string)
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400;
  }

  // ✅ ALWAYS return response (prevents hanging)
  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};


const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);

  return next(error); // ✅ explicit return prevents chaining issues
};


module.exports = { errorHandler, notFound };