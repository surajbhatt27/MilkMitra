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
        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },
        totalAmount: {
            type: Number
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

purchaseSchema.pre("save", function (next) {
    this.totalAmount = this.unitPrice * this.quantity;
    next();
});


export const Purchase = mongoose.model("Purchase", purchaseSchema)