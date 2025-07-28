import mongoose, { Schema } from "mongoose";

const milkEntrySchema = new Schema(
    {
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "Seller",
            required: true
        },
        date : {
            type: Date,
            required : true
        },
        time: {
            type: String
        },
        slot: {
            type: String,
            enum: ["morning", "evening"],
            default: "morning"
        },
        fat: {
            type: Number,
            retquired: true
        },
        snf: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        bonus: {
            type: Number,
            required: true
        }
    },
    {
        timestamps : true
    }
)

export const MilkEntry = mongoose.model("MilkEntry", milkEntrySchema)