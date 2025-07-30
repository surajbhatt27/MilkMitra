import { Router } from "express";
import{
    addPurchase,
    getPurchase,
    updatePurchase,
    deletePurchase
} from "../controllers/purchase.controller.js";
import {isAuthenticated} from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/add").post(isAuthenticated, addPurchase);
router.route("/").get(isAuthenticated, getPurchase);
router.route("/update/:id").patch(isAuthenticated, updatePurchase);
router.route("/delete/:id").delete(isAuthenticated, deletePurchase);

export default router;