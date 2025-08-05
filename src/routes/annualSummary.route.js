import { Router } from "express";
import { generateAnnualSummary } from "../controllers/annualSummary.controller.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/generate-summary").get(isAuthenticated, generateAnnualSummary);

export default router;