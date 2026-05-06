import express from "express";

import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import {
  createTaskValidator,
  taskIdValidator,
  taskQueryValidator,
  updateTaskValidator,
} from "../validators/taskValidator.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("admin"), createTaskValidator, validateRequest, createTask)
  .get(taskQueryValidator, validateRequest, getTasks);

router
  .route("/:id")
  .get(taskIdValidator, validateRequest, getTaskById)
  .put(updateTaskValidator, validateRequest, updateTask)
  .delete(taskIdValidator, validateRequest, deleteTask);

export default router;
