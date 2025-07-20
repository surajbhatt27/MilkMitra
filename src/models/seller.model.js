import mongoose, { Schema } from "mongoose";

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
            type: Number,
            required : true, 
            unique : true
        },
        phoneNumber : {
            type: Number,
            required : true, 
            unique: true
        },
        email : {
            type: String,
            lowercase: true,
            unique: true,
            sparse: true
        },
        dairyName : {
            type: String
        },
        languagePrefrence : {
            type: String,
            enum : ["Hindi", "English", "Marathi", "gujrati"],
            default: "English"
        }
    }, 
    {
        timestamps: true
    }
)

export const Seller = mongoose.model("Seller", sellerSchema)