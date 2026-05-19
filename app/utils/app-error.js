/**
 * AppError class to handle application-specific errors.
 * It extends the built-in Error class and adds additional properties
 * such as statusCode, status, and isOperational to provide more context
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    //Client error (4xx) or Server error (5xx)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
