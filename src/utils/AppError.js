// A custom error class that carries an HTTP status code alongside the message.
// Throw this in any service instead of plain `new Error(...)` so the controller
// always knows the correct status without guessing from the message string.

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export default AppError;
