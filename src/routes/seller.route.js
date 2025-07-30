import { Router } from "express";
import {
    registerSeller,
    loggedInSeller,
    logOutSeller,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentSeller,
    updateSellerProfile,
    forgetPassword,
    resetPassword
} from "../controllers/seller.controller.js";
import {isAuthenticated} from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/register").post(registerSeller);
router.route("/login").post(loggedInSeller);
router.route("/logout").post(isAuthenticated, logOutSeller);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(isAuthenticated, changeCurrentPassword);
router.route("/current-seller").get(isAuthenticated, getCurrentSeller);
router.route("/update-seller-profile").post(isAuthenticated, updateSellerProfile);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);

export default router;