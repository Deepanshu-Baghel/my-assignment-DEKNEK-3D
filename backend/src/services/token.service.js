const jwt = require("jsonwebtoken");

const createToken = (userId) => {
  const { JWT_SECRET, JWT_EXPIRES_IN = "7d" } = process.env;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables.");
  }

  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
});

module.exports = { createToken, getCookieOptions, getClearCookieOptions };
