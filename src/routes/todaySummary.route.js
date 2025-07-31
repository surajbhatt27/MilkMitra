import { Router } from "express";
import {getTodaySummary} from "../controllers/todaySummary.controller.js";
import {isAuthenticated} from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/summary").get(isAuthenticated, getTodaySummary);


export default router;