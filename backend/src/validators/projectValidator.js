import { body, param } from "express-validator";

const mongoIdParam = (field) =>
  param(field).isMongoId().withMessage(`${field} must be a valid MongoDB ID`);

const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Project name is required"),
  body("description").optional().trim(),
  body("members")
    .optional()
    .isArray()
    .withMessage("Members must be an array of user IDs"),
  body("members.*").optional().isMongoId().withMessage("Each member ID must be valid"),
];

const updateProjectValidator = [
  mongoIdParam("id"),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("description").optional().trim(),
];

const addRemoveMembersValidator = [
  mongoIdParam("id"),
  body("memberIds")
    .isArray({ min: 1 })
    .withMessage("memberIds must be a non-empty array"),
  body("memberIds.*").isMongoId().withMessage("Each member ID must be valid"),
];

const projectIdValidator = [mongoIdParam("id")];

export {
  createProjectValidator,
  updateProjectValidator,
  addRemoveMembersValidator,
  projectIdValidator,
};
