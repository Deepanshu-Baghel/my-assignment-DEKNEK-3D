const Task = require("../models/Task");
const AppError = require("../utils/AppError");

const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      isCompleted: req.body.isCompleted,
    });

    res.status(201).json({ status: "success", message: "Task created", task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const allowedUpdates = ["title", "description", "isCompleted"];
    const updates = {};

    for (const field of allowedUpdates) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Task updated",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedTask) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json({ status: "success", message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyTasks, createTask, updateTask, deleteTask };
