export const AdminAuthValidation = {
  login: (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot be empty or whitespace",
      });
    }

    next();
  },
};
