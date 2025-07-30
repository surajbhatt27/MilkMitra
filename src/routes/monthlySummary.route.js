import { Router } from "express";
import {
    generateMonthlySummary,
    getMonthlySummary
} from "../controllers/monthlySummary.controller.js";
import {isAuthenticated} from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/generate-summary").get(isAuthenticated, generateMonthlySummary);
router.route("/get-summary").get(isAuthenticated, getMonthlySummary);


export default router;