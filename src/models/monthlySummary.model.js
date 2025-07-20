import mongoose, { Schema } from "mongoose";

const monthlySummarySchema = new Schema(
    {
        sellerId: {
            type: mongoose.Types.ObjectId,
            ref: "Seller",
            required: true
        },
        month: {
            type: String,
            required: true,
            trim: true
        },
        totalMilkSuplied: {
            type: Number,
            required: true,
            min: 0
        },
        totalAmountEarned: {
            type: Number,
            required: true,
            min: 0
        },
        totalPurchaseAmount: {
            type: Number,
            required: true,
            min: 0
        },
        netPayable: {
            type: String,
            required: true,
            min: 0
        },
        totalBonus: {
            type: String,
            requied: true,
            min:0
        },
        paid: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
)

export const MonthlySummary = mongoose.model("MonthlySummary", monthlySummarySchema)