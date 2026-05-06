import { query } from "express-validator";

const dashboardQueryValidator = [
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

export { dashboardQueryValidator };
