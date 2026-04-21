const bcrypt = require("bcrypt");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const { createToken, getCookieOptions } = require("../services/token.service");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError("Email is already registered", 409));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = createToken(user._id);
    res.cookie("token", token, getCookieOptions());

    res.status(201).json({
      status: "success",
      message: "Signup successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = createToken(user._id);
    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("token", getCookieOptions());
  res.status(200).json({ status: "success", message: "Logout successful" });
};

const getCurrentUser = async (req, res) => {
  res.status(200).json({
    status: "success",
    user: sanitizeUser(req.user),
  });
};

module.exports = { signup, login, logout, getCurrentUser };
