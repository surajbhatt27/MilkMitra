import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema(
    {
        sellerId: {
            type: mongoose.Types.ObjectId,
            ref: "Seller",
            required: true
        },
        itemName: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        date: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export const Purchase = mongoose.model("Purchase", purchaseSchema)