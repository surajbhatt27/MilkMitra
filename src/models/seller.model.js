import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const sellerSchema = new Schema(
    {
        sellerName : {
            type : String,
            required: true,
            lowercase : true,
            trim : true,
            index: true
        },
        dairyCode : {
            type: String,
            required : true, 
            unique : true
        },
        phoneNumber: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/, // ensures exactly 10 digits
            unique: true
        },
        email : {
            type: String,
            lowercase: true,
            unique: true,
            required: true
        },
        dairyName : {
            type: String
        },
        languagePrefrence : {
            type: String,
            enum : ["Hindi", "English", "Marathi", "gujrati"],
            default: "English"
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String
        },
        otp: {
            type: String
        },
        otpExpiry: {
            type: Date
        },
        passwordResetToken: String,
        passwordResetExpiry: Date
    }, 
    {
        timestamps: true
    }
)

// hash password before saving.

sellerSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return next();
    }
    try{
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error){
        return next(error);
    }
})

// compare password.
sellerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//generate excess token.
sellerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            sellerName: this.sellerName,
            dairyCode: this.dairyCode
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//generate refresh token.
sellerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);