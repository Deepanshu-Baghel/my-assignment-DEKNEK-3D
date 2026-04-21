const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  next();
};

module.exports = validateRequest;
