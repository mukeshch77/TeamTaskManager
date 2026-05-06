import { body } from "express-validator";

const signupValidator = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2 }),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["admin", "member"])
    .withMessage("Role must be admin or member"),
];

const loginValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export { signupValidator, loginValidator };
