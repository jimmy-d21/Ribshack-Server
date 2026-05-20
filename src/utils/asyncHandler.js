// Wraps an async controller function and automatically forwards any thrown
// error to Express's next() error handler.  This removes the try/catch boilerplate
// from every controller so each one stays focused on the happy path.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
