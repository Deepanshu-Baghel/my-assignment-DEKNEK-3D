const { body, param } = require("express-validator");

const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Task title is required"),
  body("description").optional().trim().isLength({ max: 500 }),
  body("isCompleted").optional().isBoolean(),
];

const updateTaskValidator = [
  param("id").isMongoId().withMessage("Invalid task id"),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional().trim().isLength({ max: 500 }),
  body("isCompleted").optional().isBoolean(),
];

const taskIdValidator = [param("id").isMongoId().withMessage("Invalid task id")];

module.exports = { createTaskValidator, updateTaskValidator, taskIdValidator };
