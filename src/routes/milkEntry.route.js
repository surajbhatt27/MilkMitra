import { Router } from "express";
import{
    addMilkEntry,
    getMilkEntries,
    updateMilkEntry,
    deleteMilkEntry
} from "../controllers/milkEntry.controller.js";
import {isAuthenticated} from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/add").post(isAuthenticated, addMilkEntry);
router.route("/").get(isAuthenticated, getMilkEntries);
router.route("/update/:id").patch(isAuthenticated, updateMilkEntry);
router.route("/delete/:id").delete(isAuthenticated, deleteMilkEntry);

export default router;