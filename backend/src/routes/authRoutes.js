import express from "express";

import { getMe, login, signup } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import { loginValidator, signupValidator } from "../validators/authValidator.js";

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, signup);
router.post("/login", loginValidator, validateRequest, login);
router.get("/me", protect, getMe);

export default router;
