import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Seller} from "../models/seller.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validateHeaderName } from "http";
import sendEmail from "../utils/sendEmail.js";

const generateAccessAndRefreshToken = async (sellerId) => {
    try {
        const seller = await Seller.findById(sellerId)
        const accessToken = seller.generateAccessToken();
        const refreshToken = seller.generateRefreshToken();

        seller.refreshToken = refreshToken;
        await seller.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
    
}

const registerSeller = asyncHandler(async (req, res) => {
    // get seller details from frontend
    // validation
    // check if seller already exist
    // create seller object - create entry in db
    // remove password and refresh token field from response
    // check for seller creation 
    // return response

    const {sellerName, dairyCode, phoneNumber, email, password} = req.body;

    if (
        [sellerName, dairyCode, phoneNumber,email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existSeller = await Seller.findOne({
        $or: [{email}, {dairyCode}]
    })

    if(existSeller) {
        throw new ApiError(400, "Seller with this dairy code and email already exist")
    }

    const seller = await Seller.create({
        sellerName,
        dairyCode,
        phoneNumber,
        email,
        password
    })

    const createdSeller = await Seller.findById(seller._id).select(
        "-password -refreshToken"
    )

    if(!createdSeller) {
        throw new ApiError(500, "Something went wrong while registration")
    }

    return res
            .status(201)
            .json(
                new ApiResponse(200, createdSeller, "Seller registered successfully")
            )
})

const loggedInSeller = asyncHandler(async (req, res) => {
    // get data -> data
    // dairy code and phone number
    // find the user
    // send cookie

    const {email, phoneNumber, password} = req.body;

    if(!email || !phoneNumber) {
        throw new ApiError(400, "credentails required");
    }

    const seller = await Seller.findOne({
        $or: [{email}, {phoneNumber}]
    })

    if(!seller) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const isPasswordValid = await seller.isPasswordCorrect(password)
    if(!isPasswordValid) {
        throw new ApiError(401, "Password is invalid")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(
        seller._id
    );

    const loggedInSeller = await Seller.findById(seller._id).select(
        "-password -refreshToken"
    )

    const option = {
        httpOnly: true,
        secure: true
    };

    return res
            .status(200)
            .cookie("accesstoken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(
                new ApiResponse(
                    200,
                    {
                        loggedInSeller,
                        accessToken,
                        refreshToken
                    },
                    "Seller logged In successfully"
                )
            )
})

const logOutSeller = asyncHandler(async (req, res) => {
    if (!req.seller?._id) {
        throw new ApiError(401, "Unauthorized logout request");
    }

    const seller = await Seller.findByIdAndUpdate(
        req.seller._id,
        {
            $unset: {
                refreshToken: 1
            } 
        },
        {
            new: true
        }
    )

    if (!seller) {
        throw new ApiError(404, "Seller not found");
    }

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
            .status(200)
            .clearCookie("accessToken", option)
            .clearCookie("refreshToken", option)
            .json(new ApiResponse(200, {}, "log out successfull"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized access");
    }

    try {
        const decodeToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const seller = await Seller.findById(decodeToken?._id)

        if(!seller) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if(incomingRefreshToken !== seller?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const option = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(seller._id)

        return res
                .status(200)
                .cookie("accessToken", accessToken, option)
                .cookie("refreshToken", newRefreshToken, option)
                .json(
                    new ApiResponse(
                        200,
                        {accessToken, refreshToken: newRefreshToken},
                        "access token refreshed"
                    )
                );

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old and new passwords are required");
    }

    const seller = await Seller.findById(req.seller?._id);

    const isPasswordValid = await seller.isPasswordCorrect(oldPassword)

    if(!isPasswordValid) {
        throw new ApiError(400, "invalid old password")
    }

    seller.password = newPassword
    await seller.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
})

const getCurrentSeller = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.seller, "Current seller fetched successfully")
    );
});

const updateSellerProfile = asyncHandler(async(req, res) => {

    const {
        newSellerName,
        newDairyCode,
        newPhoneNumber,
        newEmail,
        newDairyName,
        newLanguagePreference
    } = req.body;  

    const seller = await Seller.findById(req.seller?._id);
    if (!seller) {
        throw new ApiError(404, "Seller not found");
    }

    if (newSellerName) seller.sellerName = newSellerName;
    if (newDairyCode) seller.dairyCode = newDairyCode;
    if (newPhoneNumber) seller.phoneNumber = newPhoneNumber;
    if (newEmail) seller.email = newEmail;
    if (newDairyName) seller.dairyName = newDairyName;
    if (newLanguagePreference) seller.languagePrefrence = newLanguagePreference;

    await seller.save({validateBeforeSave: false});
    const updatedSeller = await Seller.findById(seller._id).select("-password -refreshToken");

    return res
            .status(200)
            .json(new ApiResponse(200, updateSellerProfile, "Seller profile updated"));
})

const forgetPassword = asyncHandler(async(req, res) => {
    const {email} = req.body;

    if(!email) {
        throw new ApiError(401, "email is required");
    }

    const seller = await Seller.findOne({email});

    if(!seller) {
        throw new ApiError(401, "Invalid email address");
    }

    const randomToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
                            .createHash("sha256")
                            .update(randomToken)
                            .digest("hex");

    seller.passwordResetToken = hashedToken;
    seller.passwordResetExpiry = Date.now() + 5*60*1000;
    await seller.save({validateBeforeSave: false})

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${randomToken}`;
    const subject = "Reset your password";
    const message = `Click this link to reset your password: ${resetUrl}\n\nIf you didn't request this, please ignore.`;

    await sendEmail({
        to: seller.email,
        subject,
        text: message
    });

    return res
            .status(200)
            .json(new ApiResponse(200, {}, "Password reset email sent"));
})

const resetPassword = asyncHandler(async(req, res) => {

    const {token, newPassword} = req.body;
    const hashedToken = crypto
                            .createHash("sha256")
                            .update(token)
                            .digest("hex");

    const seller = await Seller.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpiry: { $gt: Date.now() }
    });

    if(!seller) {
        throw new ApiError(401, "Token is expired or Invalid");
    }
    seller.password = newPassword
    seller.passwordResetToken = undefined;
    seller.passwordResetExpiry = undefined;
    await seller.save({validateBeforeSave: false})

    return res
            .status(200)
            .json(new ApiResponse(200, {}, "Password is changed"));
})

export {
    registerSeller,
    loggedInSeller,
    logOutSeller,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentSeller,
    updateSellerProfile,
    forgetPassword,
    resetPassword
}