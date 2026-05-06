import express from "express";

import { getDashboardStats } from "../controllers/dashboardController.js";
import protect from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import { dashboardQueryValidator } from "../validators/dashboardValidator.js";

const router = express.Router();

router.get("/", protect, dashboardQueryValidator, validateRequest, getDashboardStats);

export default router;
