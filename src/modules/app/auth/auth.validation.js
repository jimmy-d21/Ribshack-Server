export const register = (req, res, next) => {
  const { fullName, email, password, contactNumber, confirmPassword } =
    req.body;

  if (!fullName || !email || !password || !contactNumber || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  if (!fullName.trim() || !email.trim() || !contactNumber.trim()) {
    return res.status(400).json({
      success: false,
      message: "Fields cannot be empty or whitespace",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  next();
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  if (!email.trim() || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: "Fields cannot be empty or whitespace",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  next();
};
