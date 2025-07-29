import jwt from "jsonwebtoken";
import Seller from "../models/seller.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";


const isAuthenticated = asyncHandler( async(req, res, next) => {
    let token;

    if(req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    else if(req.header.authorization?.startWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        throw new ApiError(401, "Not authorized. Token missing");
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const seller = await Seller.findById(decode._id).select("-password -refreshToken");

    if(!seller) {
        throw new ApiError(401, "Not authorized. Seller not found");
    }

    req.seller = seller;
    next();
})

export{isAuthenticated};