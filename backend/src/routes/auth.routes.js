const express = require("express");
const {
  signup,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  resendVerification,
} = require("../controllers/auth.controller");
const validateRequest = require("../middleware/validate.middleware");
const { protect } = require("../middleware/auth.middleware");
const {
  signupValidator,
  loginValidator,
  verifyEmailValidator,
  resendVerificationValidator,
} = require("../validators/auth.validators");

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, signup);
router.post("/login", loginValidator, validateRequest, login);
router.post("/verify-email", verifyEmailValidator, validateRequest, verifyEmail);
router.post(
  "/resend-verification",
  resendVerificationValidator,
  validateRequest,
  resendVerification
);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);

module.exports = router;
