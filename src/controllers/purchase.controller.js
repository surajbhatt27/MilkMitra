import { application } from "express";
import { Purchase } from "../models/purchase.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addPurchase = asyncHandler(async(req, res) => {
    const {
        itemName,
        quantity = 1,
        unitPrice,
        date = Date.now(),
        description
    } = req.body;
    
    if(!itemName ||!unitPrice) {
        throw new ApiError(400, "Item name and price required");
    }

    const newPurchase = await Purchase.create({
        sellerId: req.seller._id,
        itemName,
        quantity,
        unitPrice,
        date,
        description
    })
    
    return res
            .status(200)
            .json(new ApiResponse(200, newPurchase, "Purchase entry added"));
})

const getPurchase = asyncHandler(async (req, res) => {
    const {itemName, startDate, endDate} = req.query;
    const filter = {sellerId: req.seller._id};

    if(itemName) {
        filter.itemName = new RegExp(itemName, "i");
    }

    if (startDate && endDate) {
        filter.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    const purchases = await Purchase.find(filter).sort({ date: -1 });

    return res
            .status(200)
            .json(new ApiResponse(200, purchases, "Purchase Items are fetched"));
})

const updatePurchase = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {
        itemName,
        quantity,
        unitPrice,
        date,
        description
    } = req.body;

    const updateEntry = await Purchase.findOne({
        _id: id,
        sellerId: req.seller._id
    })

    if(!updateEntry) {
        throw new ApiError(400, "Purchase entry not found");
    }

    if(itemName) updateEntry.itemName = itemName;
    if(quantity) updateEntry.quantity = quantity;
    if(unitPrice) updateEntry.unitPrice = unitPrice;
    if (quantity || unitPrice) {
        updateEntry.finalPrice = (updateEntry.unitPrice || 0) * (updateEntry.quantity || 0);
    }
    if(date) updateEntry.date = date;
    if(description) updateEntry.description = description;

    await updateEntry.save();

    return res
            .status(200)
            .json(new ApiResponse(200, updateEntry, "Purchase entry is updated successfully"));
})

const deletePurchase = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const deleteEntry = await Purchase.findOneAndDelete({
        _id: id,
        sellerId: req.seller._id
    })
    if(!deleteEntry) {
        throw new ApiError(404, "Purchase entry is not found or deleted");
    }

    return res
            .status(200)
            .json(new ApiResponse(200, {}, "Purchase entry is deleted successfully"));
})

export{
    addPurchase,
    getPurchase,
    updatePurchase,
    deletePurchase
}