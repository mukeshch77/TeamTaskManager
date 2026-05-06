import { body, param, query } from "express-validator";

const mongoIdParam = (field) =>
  param(field).isMongoId().withMessage(`${field} must be a valid MongoDB ID`);

const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Task title is required"),
  body("description").optional().trim(),
  body("assignedTo").isMongoId().withMessage("assignedTo must be a valid user ID"),
  body("project").isMongoId().withMessage("project must be a valid project ID"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Status must be todo, in-progress, or done"),
  body("dueDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("dueDate must be a valid ISO date"),
];

const updateTaskValidator = [
  mongoIdParam("id"),
  body("title").optional().trim().notEmpty(),
  body("description").optional().trim(),
  body("assignedTo").optional().isMongoId().withMessage("assignedTo must be valid"),
  body("project").optional().isMongoId().withMessage("project must be valid"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Status must be todo, in-progress, or done"),
  body("dueDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("dueDate must be a valid ISO date"),
];

const taskIdValidator = [mongoIdParam("id")];

const taskQueryValidator = [
  query("project").optional().isMongoId().withMessage("project filter must be valid"),
  query("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("assignedTo filter must be valid"),
  query("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("status filter must be todo, in-progress, or done"),
];

export { createTaskValidator, updateTaskValidator, taskIdValidator, taskQueryValidator };
