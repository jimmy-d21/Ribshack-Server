// A single reusable middleware factory that validates req.body against any Zod
// schema.  On failure it immediately returns a 400 with the first error message.
// On success it replaces req.body with the parsed (and coerced) data.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0]?.message;
    return res.status(400).json({ success: false, message });
  }

  req.body = result.data;
  next();
};
