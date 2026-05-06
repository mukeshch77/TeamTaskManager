import express from "express";

import {
  addMembers,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  removeMembers,
  updateProject,
} from "../controllers/projectController.js";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import {
  addRemoveMembersValidator,
  createProjectValidator,
  projectIdValidator,
  updateProjectValidator,
} from "../validators/projectValidator.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("admin"), createProjectValidator, validateRequest, createProject)
  .get(getProjects);

router
  .route("/:id")
  .get(projectIdValidator, validateRequest, getProjectById)
  .put(authorizeRoles("admin"), updateProjectValidator, validateRequest, updateProject)
  .delete(authorizeRoles("admin"), projectIdValidator, validateRequest, deleteProject);

router.post(
  "/:id/members",
  authorizeRoles("admin"),
  addRemoveMembersValidator,
  validateRequest,
  addMembers
);

router.delete(
  "/:id/members",
  authorizeRoles("admin"),
  addRemoveMembersValidator,
  validateRequest,
  removeMembers
);

export default router;
