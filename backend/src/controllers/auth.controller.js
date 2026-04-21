const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const {
  createToken,
  getCookieOptions,
  getClearCookieOptions,
} = require("../services/token.service");
const { sendVerificationEmail } = require("../services/email.service");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  emailVerified: Boolean(user.emailVerified),
  createdAt: user.createdAt,
});

const createEmailVerificationPayload = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresInHours = Number(process.env.EMAIL_VERIFICATION_EXPIRES_HOURS || 24);

  return {
    rawToken,
    tokenHash,
    expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
  };
};

const sendEmailVerificationForUser = async (user) => {
  const { rawToken, tokenHash, expiresAt } = createEmailVerificationPayload();

  user.emailVerificationToken = tokenHash;
  user.emailVerificationTokenExpires = expiresAt;
  await user.save();

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const verificationLink = `${clientUrl}/verify-email?token=${encodeURIComponent(rawToken)}`;

  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    verificationLink,
  });
};

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError("Email is already registered", 409));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
    });

    try {
      await sendEmailVerificationForUser(user);
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);
      return next(
        new AppError(
          "Could not send verification email. Please try signing up again.",
          500
        )
      );
    }

    res.status(201).json({
      status: "success",
      message: "Signup successful. Please verify your email before login.",
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

    if (user.emailVerified === false) {
      return next(
        new AppError("Please verify your email before logging in.", 403, {
          code: "EMAIL_NOT_VERIFIED",
          email: user.email,
        })
      );
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
  res.clearCookie("token", getClearCookieOptions());
  res.status(200).json({ status: "success", message: "Logout successful" });
};

const getCurrentUser = async (req, res) => {
  res.status(200).json({
    status: "success",
    user: sanitizeUser(req.user),
  });
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationTokenExpires: { $gt: new Date() },
    }).select("+emailVerificationToken +emailVerificationTokenExpires");

    if (!user) {
      return next(new AppError("Verification link is invalid or expired.", 400));
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const genericMessage =
      "If an account with that email exists, a verification email has been sent.";

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ status: "success", message: genericMessage });
    }

    if (user.emailVerified === true) {
      return res.status(200).json({
        status: "success",
        message: "Email is already verified. Please log in.",
      });
    }

    await sendEmailVerificationForUser(user);

    res.status(200).json({
      status: "success",
      message: genericMessage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  resendVerification,
};
