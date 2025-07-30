import { Router } from "express";
import {getTodaySummary} from "../controllers/todaySummary.controller.js";
import {isAuthenticated} from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/today").get(isAuthenticated, getTodaySummary);


export default router;