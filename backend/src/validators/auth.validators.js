const { body } = require("express-validator");

const signupValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Provide a valid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
  body("email").isEmail().withMessage("Provide a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const verifyEmailValidator = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Verification token is required")
    .isLength({ min: 20 })
    .withMessage("Verification token is invalid"),
];

const resendVerificationValidator = [
  body("email").isEmail().withMessage("Provide a valid email").normalizeEmail(),
];

module.exports = {
  signupValidator,
  loginValidator,
  verifyEmailValidator,
  resendVerificationValidator,
};
