export const StoreAuthValidation = {
  login: (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    if (!username.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot be empty or whitespace",
      });
    }

    next();
  },
};
