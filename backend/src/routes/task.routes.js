const express = require("express");
const {
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");
const validateRequest = require("../middleware/validate.middleware");
const { protect } = require("../middleware/auth.middleware");
const {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
} = require("../validators/task.validators");

const router = express.Router();

router.use(protect);

router.get("/", getMyTasks);
router.post("/", createTaskValidator, validateRequest, createTask);
router.put("/:id", updateTaskValidator, validateRequest, updateTask);
router.delete("/:id", taskIdValidator, validateRequest, deleteTask);

module.exports = router;
